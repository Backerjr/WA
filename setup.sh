#!/usr/bin/env bash
# =============================================================================
# setup.sh – Bootstrap script for the polyglot-starter monorepo
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log_info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
banner()      { echo -e "\n${CYAN}=== $* ===${NC}"; }

check_node() {
  banner "Checking Node.js version"
  if ! command -v node >/dev/null 2>&1; then log_error "Node.js ≥18 required."; exit 1; fi
  NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
  (( NODE_MAJOR < 18 )) && { log_error "Node.js 18+ required, found $(node -v)"; exit 1; }
  log_success "Node.js $(node -v) detected."
}

check_pnpm() {
  banner "Checking pnpm"
  if command -v pnpm >/dev/null 2>&1; then log_success "pnpm $(pnpm -v) available."; return; fi
  log_warn "pnpm not found. Installing via Corepack..."
  corepack enable && corepack prepare pnpm@latest --activate
  command -v pnpm >/dev/null 2>&1 || { log_error "pnpm install failed."; exit 1; }
  log_success "pnpm installed successfully."
}

setup_env() {
  banner "Setting up environment files"
  for ws in api web proxy; do
    if [[ -d "$ws" ]]; then
      [[ -f "$ws/.env.example" && ! -f "$ws/.env" ]] && { cp "$ws/.env.example" "$ws/.env"; log_success "Created .env in $ws"; } || log_info "No .env action for $ws"
    fi
  done
}

install_deps() { banner "Installing dependencies"; pnpm install; log_success "Dependencies installed."; }

build_workspaces() {
  banner "Building workspaces"
  for ws in api proxy web; do
    [[ -d "$ws" ]] && { log_info "Building $ws..."; pnpm --filter "$ws" run build --if-present; log_success "$ws build done."; }
  done
}

start_dev_servers() {
  banner "Starting development servers"
  existing_ws=(); for ws in api web proxy; do [[ -d "$ws" ]] && existing_ws+=("$ws"); done
  if (( ${#existing_ws[@]} == 0 )); then log_warn "No workspaces found."; return; fi
  if pnpm exec concurrently --version >/dev/null 2>&1; then
    log_info "Starting via concurrently"
    cmd=("pnpm" "exec" "concurrently"); for ws in "${existing_ws[@]}"; do cmd+=("pnpm --filter $ws run dev --if-present"); done
    "${cmd[@]}" &
    CONC_PID=$!; export CONC_PID; log_success "concurrently started (PID $CONC_PID)"
  else
    log_warn "No concurrently; starting background processes."
    pids=(); for ws in "${existing_ws[@]}"; do pnpm --filter "$ws" run dev --if-present & pids+=($!); log_success "Started $ws (PID ${pids[-1]})"; done
    DEV_SERVER_PIDS="${pids[*]}"; export DEV_SERVER_PIDS
  fi
}

docker_setup() {
  if ! command -v docker >/dev/null 2>&1; then log_info "Docker not detected."; return; fi
  banner "Docker detected"
  if command -v docker-compose >/dev/null 2>&1; then COMPOSE_CMD="docker-compose"
  elif docker compose version >/dev/null 2>&1; then COMPOSE_CMD="docker compose"
  else log_warn "No compose command found."; return; fi
  if [ -t 0 ]; then
    printf "${CYAN}Start Docker containers now? (y/N): ${NC}"; read -r a; a=$(echo "$a" | tr '[:upper:]' '[:lower:]')
    [[ "$a" == "y" || "$a" == "yes" ]] && { log_info "Running $COMPOSE_CMD up -d"; $COMPOSE_CMD up -d; log_success "Docker containers up."; } || log_info "Skipping Docker."
  else log_info "Non-interactive mode; skipping Docker."; fi
}

print_success_banner() {
  echo -e "\n${GREEN}✅ All services installed and running!${NC}"
  [[ -n "${CONC_PID-}" ]] && echo -e " • To stop: ${YELLOW}kill $CONC_PID${NC}"
  [[ -n "${DEV_SERVER_PIDS-}" ]] && echo -e " • To stop background servers: ${YELLOW}kill $DEV_SERVER_PIDS${NC}"
  echo -e " • Manual runs:\n   ${YELLOW}pnpm --filter api run dev${NC}\n   ${YELLOW}pnpm --filter web run dev${NC}\n   ${YELLOW}pnpm --filter proxy run dev${NC}"
  command -v docker >/dev/null 2>&1 && echo -e " • Docker:\n   ${YELLOW}docker compose up -d${NC}\n   ${YELLOW}docker compose down${NC}"
  echo -e " • For production builds, see workspace READMEs."
}

main() {
  cd "$(dirname "$0")"

  # Parse flags
  SKIP_DEV_SERVERS=false
  for arg in "$@"; do
    case "$arg" in
      --skip-dev-servers)
        SKIP_DEV_SERVERS=true
        shift
        ;;
      *) ;;
    esac
  done

  check_node
  check_pnpm
  setup_env
  install_deps
  build_workspaces

  if [ "$SKIP_DEV_SERVERS" = true ]; then
    log_info "Skipping dev servers as requested (--skip-dev-servers)."
  else
    start_dev_servers
  fi

  docker_setup
  print_success_banner
}

main "$@"
