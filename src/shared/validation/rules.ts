export const REGEX_VALIDATION = {
    NUMBERS_ONLY: /^\p{N}+$/gu,
    LETTERS_ONLY: /^(\p{L})+$/gu,
    LETTERS_SPACES: /^(\p{L}|\s)+$/gu,
    LETTERS_NUMBERS: /^(\p{L}|\p{N})+$/gu,
    LETTERS_NUMBERS_SPACES: /^(\p{L}|\p{N}|\s)+$/gu,
    LETTERS_NUMBERS_SPACES_HYPHEN: /^(\p{L}|\d| |-|–|—|‒|−|‐)+$/gu,
    LETTERS_NUMBERS_SYMBOLS_SPACES: /^(\p{L}|\p{N}|\s|[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/#@№])+$/u,
    TRANSLATION_KEY: /^(\p{L}|\p{N}|\s|_|-)+$/gu,
    EMAIL: /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#\$%\^&\*?><:;'"\\|\[\]{}\+=_\(\).,-])(?=.{8,})/g,
    NON_WHITESPACE_CHARACTERS_EXCLUDE_NEW_LINE: /[^\S\n]+/g,
    NEW_LINE_CHARACTERS: /\n+/g,
};

export const COUNT_VALIDATION = {
    MAX_PARAMETER_OPTIONS_COUNT: 30,
};

export const MAX_HTML_BODY_LENGTH_MULTIPLIER = 3;
export const AT_LEAST_TWO_MORE_HTML_TAGS_WITH_BR_REGEX = new RegExp(/(<\w+><br><\/\w+>\s*){2,}/g);
