#!/bin/bash
# Comprueba archivos duplicados .js/.jsx (mismo nombre base) en pages/ y components/
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

DIRS=("$REPO_ROOT/frontend/src/pages" "$REPO_ROOT/frontend/src/components")
ENCONTRADOS=0

for dir in "${DIRS[@]}"; do
  [ -d "$dir" ] || continue
  for f in "$dir"/*.jsx; do
    [ -e "$f" ] || continue
    base="${f%.jsx}"
    if [ -f "${base}.js" ]; then
      echo "⚠️  DUPLICADO: ${base}.js Y ${base}.jsx"
      ENCONTRADOS=1
    fi
  done
done

if [ "$ENCONTRADOS" -eq 0 ]; then
  echo "✅ Sin duplicados .js/.jsx en pages/ ni components/"
else
  echo ""
  echo "Borra cada .js viejo listado arriba antes de dar el cambio por aplicado."
fi
