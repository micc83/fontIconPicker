module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "wordpress",
    "parserOptions": {
		"ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
		],
		"space-in-parens": [
			"error",
			"always",
			{
				"exceptions": ["empty"]
			}
		],
		"space-unary-ops": [
            'error', {
                "words": true,
                "nonwords": false,
                "overrides": {
                    "!": true
                }
            }
		],
		"key-spacing": [
			"error", {
				"align": {
					"beforeColon": true,
					"afterColon": true,
					"on": "colon"
				}
			}
		]
    }
};
