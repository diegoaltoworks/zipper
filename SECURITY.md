# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately using one of these methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to https://github.com/diegoaltoworks/zipper/security/advisories/new
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Email**
   - Send details to: diego@diegoalto.works
   - Use subject line: `[SECURITY] Zipper - <brief description>`
   - Include detailed information (see below)

### What to Include

When reporting a vulnerability, please include:

1. **Description**
   - Type of vulnerability
   - Affected versions
   - Potential impact

2. **Reproduction Steps**
   - Step-by-step instructions
   - Code samples
   - Screenshots if applicable

3. **Proof of Concept**
   - Minimal code to demonstrate the issue
   - Expected vs actual behavior

4. **Suggested Fix** (optional)
   - Your ideas for addressing the issue
   - Pull request (after private disclosure)

### Example Report

```
Subject: [SECURITY] Zipper - XSS vulnerability in filename handling

Description:
File names from user input are not properly sanitized before being
added to the ZIP archive, potentially allowing XSS attacks when the
ZIP is extracted and filenames are displayed.

Affected Versions:
- 1.0.0 and earlier

Steps to Reproduce:
1. Call zipper with malicious filename:
   await zipper([{
     url: '/file.pdf',
     name: '<script>alert("xss")</script>.pdf'
   }]);
2. Extract ZIP
3. View file list in file manager or web interface

Potential Impact:
- Medium: XSS if filenames are displayed in web UI
- Affects applications using this library

Suggested Fix:
Sanitize filenames to remove special characters
```

## Response Timeline

We aim to respond to security reports according to this timeline:

1. **Initial Response**: Within 48 hours
   - Acknowledgment of receipt
   - Initial assessment

2. **Investigation**: Within 7 days
   - Confirm vulnerability
   - Assess severity
   - Determine affected versions

3. **Fix Development**: Within 14 days
   - Develop patch
   - Internal testing
   - Prepare security advisory

4. **Public Disclosure**: After patch release
   - Release patched version
   - Publish security advisory
   - Credit reporter (if desired)

## Security Best Practices

### For Users of Zipper

1. **Keep Updated**
   - Always use the latest version
   - Monitor for security updates
   - Subscribe to GitHub releases

2. **Validate Input**
   - Sanitize file URLs from user input
   - Validate filenames
   - Use allowlists for allowed file types

3. **HTTPS Only**
   - Only download from HTTPS URLs
   - Verify SSL certificates
   - Don't mix HTTP and HTTPS content

4. **Content Security Policy**
   - Implement strict CSP headers
   - Use blob: URLs carefully
   - Validate downloaded content

### Example: Secure Usage

```typescript
import { zipper } from '@diegoaltoworks/zipper';

// BAD: Unsanitized user input
await zipper([{
  url: userProvidedUrl,  // ❌ Could be malicious
  name: userProvidedName // ❌ Could contain XSS
}]);

// GOOD: Validated and sanitized
const safeUrl = validateAndSanitizeUrl(userProvidedUrl);
const safeName = sanitizeFilename(userProvidedName);

if (safeUrl && safeName) {
  await zipper([{
    url: safeUrl,         // ✅ Validated
    name: safeName        // ✅ Sanitized
  }]);
}

// Helper functions (example)
function validateAndSanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS from trusted domains
    if (parsed.protocol !== 'https:') return null;
    if (!TRUSTED_DOMAINS.includes(parsed.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function sanitizeFilename(name: string): string {
  // Remove special characters, keep only safe chars
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
```

## Known Security Considerations

### 1. Client-Side ZIP Creation

- All processing happens in the browser
- Large files may cause memory issues
- Browser may crash with extremely large downloads

**Mitigation:**
- Implement file size limits
- Monitor memory usage
- Provide user feedback

### 2. CORS Restrictions

- Can only download from same-origin or CORS-enabled URLs
- Failed CORS requests expose no details (browser security)

**Mitigation:**
- Ensure proper CORS headers on file servers
- Use same-origin URLs when possible
- Provide clear error messages

### 3. Blob URL Lifetime

- Blob URLs persist in memory until revoked
- Can cause memory leaks if not cleaned up

**Mitigation:**
- Library automatically revokes blob URLs
- Don't prevent page unload during downloads

### 4. Filename Injection

- Filenames are user-controlled
- Could contain path traversal characters

**Mitigation:**
- Sanitize filenames before use
- JSZip handles path traversal safely
- Validate all user input

## Dependency Security

We monitor dependencies for security issues:

1. **Automated Scanning**
   - Dependabot enabled for automatic updates
   - npm audit run on every build
   - CodeQL security scanning

2. **Direct Dependencies**
   - `jszip`: Actively maintained, security-audited
   - `file-saver`: Minimal, well-tested

3. **Update Policy**
   - Security patches: Immediate update
   - Minor updates: Weekly review
   - Major updates: Thorough testing required

## Security Tooling

### Automated Scans

```bash
# npm security audit
npm audit

# Fix automatically (if possible)
npm audit fix

# Check for known vulnerabilities
npm audit --audit-level=high
```

### GitHub Security Features

We use these GitHub security features:

- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ CodeQL analysis
- ✅ Secret scanning
- ✅ Private vulnerability reporting

## Disclosure Policy

We follow responsible disclosure:

1. **Private disclosure** to maintainers first
2. **30-day embargo** for critical issues
3. **Public disclosure** after patch is released
4. **Credit** to reporter in security advisory
5. **CVE assignment** for major vulnerabilities

## Hall of Fame

We appreciate security researchers who help keep Zipper secure:

<!-- Will list security researchers who responsibly disclose vulnerabilities -->

*No reports yet*

## Contact

For security concerns:
- **Security Email**: diego@diegoalto.works
- **GitHub Advisories**: https://github.com/diegoaltoworks/zipper/security/advisories/new
- **PGP Key**: Available on request

For general questions:
- **GitHub Issues**: https://github.com/diegoaltoworks/zipper/issues
- **GitHub Discussions**: https://github.com/diegoaltoworks/zipper/discussions

## License

This security policy is part of the Zipper project and is licensed under MIT.
