# MCP Server Setup Instructions

This project is configured to use Model Context Protocol (MCP) servers to enhance Claude Code's capabilities.

## Configured MCP Servers

### 1. GitHub MCP Server ✓
Provides access to GitHub repository data, including:
- Commit history and diffs
- Pull requests and issues
- Repository files and structure
- Branch information

**Repository**: `ittapopo/mafios`
**Requires**: GitHub Personal Access Token (see setup below)

### 2. Git MCP Server ✓
Provides local Git operations:
- View commit history
- Check repository status
- Show diffs and changes
- Branch management

**No configuration required**

### 3. Filesystem MCP Server ✓
Enhanced filesystem access for this project directory.

**No configuration required**

### 4. Fetch MCP Server ✓
Web content fetching and conversion:
- Fetch documentation from the web
- Convert HTML to markdown
- Access API documentation
- Pull examples from MDN, React docs, etc.

**No configuration required**

### 5. Brave Search MCP Server (Optional)
Search the web for documentation and examples:
- Search technical documentation
- Find code examples
- Look up Next.js/React/TailwindCSS patterns

**Requires**: Brave Search API Key (see setup below)
**Note**: Optional - can use without if you don't need web search

### 6. Memory MCP Server ✓
Persistent knowledge graph across sessions:
- Remember game design decisions
- Track feature requirements
- Store architectural decisions
- Maintain context between sessions

**No configuration required**

### 7. Postgres MCP Server (Optional)
Database operations for when you add persistence:
- Query database
- Inspect schema
- Run SQL commands
- Manage data

**Requires**: PostgreSQL database connection
**Note**: Currently configured for `postgresql://localhost/mafios` - update as needed

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name (e.g., "MCP Server - Mafios")
4. Set expiration as needed
5. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure GitHub in .mcp.json

1. Open `.mcp.json` in the project root
2. Replace `<YOUR_GITHUB_TOKEN_HERE>` with your actual GitHub token
3. Save the file

**Important**: The `.mcp.json` file contains your GitHub token. Make sure it's in `.gitignore`!

### Step 3 (Optional): Set up Brave Search API

If you want web search capabilities:

1. Go to https://brave.com/search/api/
2. Sign up for a free API key (1,000 queries/month free)
3. Copy your API key
4. Open `.mcp.json` and replace `<YOUR_BRAVE_API_KEY_HERE>` with your key

**Note**: This is optional. Remove the `brave-search` section from `.mcp.json` if you don't need it.

### Step 4 (Optional): Configure PostgreSQL

If you want to add database persistence:

1. Install PostgreSQL locally or use a cloud provider
2. Create a database named `mafios`
3. Update the connection string in `.mcp.json`:
   ```json
   "postgresql://username:password@host:port/mafios"
   ```

**Note**: This is optional. Remove the `postgres` section from `.mcp.json` if you don't need it yet.

### Step 5: Verify MCP Configuration

The MCP servers will be automatically loaded when you restart Claude Code.

You can verify by asking Claude Code to:
- "Show me the recent commit history" (uses GitHub/Git MCP)
- "What changes were made in the last commit?" (uses Git MCP)
- "Fetch the React 19 documentation" (uses Fetch MCP)
- "Remember that we're building a mafia-themed browser game" (uses Memory MCP)

## Security Notes

- **Never commit your GitHub token** to version control
- The `.mcp.json` file is already added to `.gitignore`
- Keep your token secure and rotate it regularly
- Use tokens with minimal required permissions

## Troubleshooting

### MCP servers not working?
1. Ensure Node.js is installed (`node --version`)
2. Check that `npx` is available
3. Verify your GitHub token is valid
4. Restart Claude Code

### GitHub API rate limits?
If you hit rate limits, the token will help increase your limit from 60 to 5,000 requests per hour.

## What Can These MCP Servers Do?

### For Web Development (Your Use Case):
- **Fetch**: Pull documentation for Next.js, React, TailwindCSS, TypeScript
- **Memory**: Remember your game mechanics, design decisions, and feature plans across sessions
- **GitHub/Git**: Track code changes, manage PRs, view history
- **Filesystem**: Read and manage project files efficiently

### For Future Enhancements:
- **Postgres**: When you add user accounts, leaderboards, or persistent game state
- **Brave Search**: Find code examples and documentation online

## Quick Start Checklist

- [x] GitHub MCP Server (configured)
- [x] Git MCP Server (configured)
- [x] Filesystem MCP Server (configured)
- [x] Fetch MCP Server (configured)
- [x] Memory MCP Server (configured)
- [ ] Brave Search (optional - requires API key)
- [ ] Postgres (optional - requires database)

**You're ready to go with 5/7 servers!** The optional ones can be added later when needed.
