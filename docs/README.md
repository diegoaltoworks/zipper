# Zipper Documentation Site

This is the interactive documentation and examples site for the [Zipper](https://github.com/diegoaltoworks/zipper) package.

**Live site:** [diegoaltoworks.github.io/zipper](https://diegoaltoworks.github.io/zipper)

## What's Here

This documentation site includes:

- **Interactive Examples**: Try the package right in your browser
- **Code Samples**: Copy-paste ready examples for common use cases
- **Playground**: Experiment with different configurations
- **Server-Side Patterns**: Node.js, Next.js, and Express examples
- **Test Files**: 100+ sample files (PDFs, PNGs, text) for testing

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3333`

## Building for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, which is deployed to GitHub Pages.

## Full Demo Application

For a complete full-stack demo with server-side ZIP generation, see:

**[zipper-demo.vercel.app](https://zipper-demo.vercel.app)**

Source code: [github.com/diegoaltoworks/zipper-demo](https://github.com/diegoaltoworks/zipper-demo)

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**

## Pages

- `/` - Basic demo with file selection
- `/progress` - Progress bar visualization
- `/mixed` - Mixed file types demonstration
- `/playground` - Interactive code playground
- `/server` - Server-side usage examples

## License

MIT - Same as the main Zipper package
