// This class is based off code from the following video: https://www.youtube.com/watch?v=yTlmOpW6kOc&t=374s
// This class contains an object which stores the different states the player or enemies can be in, this sis used by those calsses to set the correct animations
const CharacterStates = {
    idle: 'idle',
    walk: 'walk',
    run: 'run',
    jump: 'jump',
    attack: 'attack',
    hurt: 'hurt',
    die: 'die',
};
export default CharacterStates;