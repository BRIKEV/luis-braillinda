#!/usr/bin/env bash
# Lists which illustrations are present and which are still missing.
# Re-run any time: bash art-prompts/check-art.sh
cd "$(dirname "$0")/.." || exit 1

check() { # <path> <label>
  if compgen -G "$1".* > /dev/null; then
    echo "  [x] $2"
  else
    echo "  [ ] $2   <- MISSING"
    MISSING=$((MISSING+1))
  fi
}
MISSING=0

echo "BACKGROUNDS  src/images/backgrounds/"
check src/images/backgrounds/bg-workshop  "bg-workshop    style anchor, ~80% of the story"
check src/images/backgrounds/bg-meadow    "bg-meadow      entries 1-12, the poppy meadow"
check src/images/backgrounds/bg-paris     "bg-paris       the journey, optional"

echo
echo "BRAILLINDA   src/images/characters/braillinda/   (faces LEFT, floats)"
check src/images/characters/braillinda/curious   "curious        default, most dialogue"
check src/images/characters/braillinda/delighted "delighted      '¡Que facil! Ya puedo escribir'"
check src/images/characters/braillinda/cross     "cross          she kicks dot 5 across the cell"
check src/images/characters/braillinda/wistful   "wistful        the opening, sad she cannot read"

echo
echo "LUIS         src/images/characters/luis/         (faces RIGHT, stands)"
check src/images/characters/luis/explaining "explaining     default, most dialogue"
check src/images/characters/luis/pleased    "pleased        'Queda muy bien'"
check src/images/characters/luis/asleep     "asleep         she finds him dozing"
check src/images/characters/luis/surprised  "surprised      '¿Quien eres tu?'"
check src/images/characters/luis/annoyed    "annoyed        '¡Estoy harto de tus alas!'"

echo
echo "ABUELA       src/images/characters/abuela/       (faces RIGHT, floats)"
check src/images/characters/abuela/thoughtful  "thoughtful     'Pero eso no son letras...', se quedo pensativa"
check src/images/characters/abuela/encouraging "encouraging    'Vete a verlo y ayudale'"

echo
if [ "$MISSING" -eq 0 ]; then
  echo "All present."
else
  echo "$MISSING missing. Prompts are in art-prompts/paste-ready.md"
fi
echo "Any extension is fine (.jpg/.png). Magenta background, I key it out."
