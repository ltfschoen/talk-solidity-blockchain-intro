export default function extend(highlighter) {

// Inject Solidity syntax highlighting
// @see https://github.com/consensys/contract-viewer
//
// :TODO:
// - fixed point numbers
// - match built-in members, but only as members (must have dot prefix)
// - match built-in visibility specifiers as keywords
// - `_` inside modifiers
// - assembly block keywords

highlighter.engine.registerLanguage('solidity', function(hljs) {
    var SOL_KEYWORDS = {
    keyword:
        'var bool string ' +
        'int uint int8 uint8 int16 uint16 int24 uint24 int32 uint32 ' +
        'int40 uint40 int48 uint48 int56 uint56 int64 uint64 ' +
        'int72 uint72 int80 uint80 int88 uint88 int96 uint96 ' +
        'int104 uint104 int112 uint112 int120 uint120 int128 uint128 ' +
        'int136 uint136 int144 uint144 int152 uint152 int160 uint160 ' +
        'int168 uint168 int176 uint176 int184 uint184 int192 uint192 ' +
        'int200 uint200 int208 uint208 int216 uint216 int224 uint224 ' +
        'int232 uint232 int240 uint240 int248 uint248 int256 uint256 ' +
        'byte bytes1 bytes2 bytes3 bytes4 bytes5 bytes6 bytes7 bytes8 ' +
        'bytes9 bytes10 bytes11 bytes12 bytes13 bytes14 bytes15 bytes16 ' +
        'bytes17 bytes18 bytes19 bytes20 bytes21 bytes22 bytes23 bytes24 ' +
        'bytes25 bytes26 bytes27 bytes28 bytes29 bytes30 bytes31 bytes32 ' +
        'enum struct mapping address ' +

        'delete ' +
        'if else for while continue break return throw ' +

        'function modifier event ' +
        'constant anonymous indexed ' +
        'storage memory ' +
        'external public internal private returns ' +

        'import using ' +
        'contract library ' +
        'assembly',
    literal:
        'true false ' +
        'wei szabo finney ether ' +
        'second seconds minute minutes hour hours day days week weeks year years',
    built_in:
        'now ' +
        // 'balance length push ' +
        'this super selfdestruct ' + //'send call callcode delegatecall ' +
        'msg ' + //'data gas sender sig value ' +
        'block ' + //'blockhash coinbase difficulty gaslimit number timestamp ' +
        'tx ' + //'gasprice origin ' +
        'sha3 sha256 ripemd160 erecover addmod mulmod ',
    };

    var SOL_FUNC_PARAMS = {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: SOL_KEYWORDS,
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
    };

  return {
    aliases: ['sol'],
    keywords: SOL_KEYWORDS,
    contains: [
      // basic literal definitions
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        variants: [
          { begin: '\\b(0[bB][01]+)' },
          { begin: '\\b(0[oO][0-7]+)' },
          { begin: hljs.C_NUMBER_RE }
        ],
        relevance: 0
      },
      // functions
      {
        className: 'function',
        beginKeywords: 'function modifier', end: /[{;=]/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {
            begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
            keywords: SOL_KEYWORDS
          }),
          SOL_FUNC_PARAMS
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE,
        relevance: 0 // hack: prevents detection of keywords after dots
      },
      { // contracts & libraries
        className: 'class',
        beginKeywords: 'contract library', end: /[{]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'is'},
          hljs.UNDERSCORE_TITLE_MODE,
          SOL_FUNC_PARAMS
        ]
      },
      // imports
      {
        beginKeywords: 'import', end: '[;$]',
        keywords: 'import * from as',
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
    ],
    illegal: /#/
  };
});

}