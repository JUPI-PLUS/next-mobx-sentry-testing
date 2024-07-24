/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontSize: {
            xs: ".75rem",
            sm: "13px",
            md: "15px",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "2rem",
        },
        extend: {
            fontFamily: {
                sans: ["Manrope, sans-serif"],
            },
            colors: {
                dark: {
                    100: "rgba(7, 23, 48, 0.04)",
                    200: "rgba(7, 23, 48, 0.06)",
                    300: "rgba(7, 23, 48, 0.08)",
                    400: "rgba(7, 23, 48, 0.16)",
                    500: "rgba(7, 23, 48, 0.24)",
                    600: "rgba(7, 23, 48, 0.32)",
                    700: "rgba(7, 23, 48, 0.48)",
                    800: "rgba(7, 23, 48, 0.64)",
                    900: "rgba(7, 23, 48, 1)",
                },
                red: {
                    100: "#E83E50",
                    "100-1": "#B10E0E",
                    "100-2": "#FBE0E3",
                },
                pink: {
                    100: "#F64444",
                },
                yellow: {
                    100: "#FE9C55",
                    "100-1": "#FFE381",
                    "100-2": "#FEE7D6",
                },
                orange: {
                    "100-1": "#FFAC60",
                },
                green: {
                    100: "#39B983",
                    "100-1": "#A5E091",
                },
                light: {
                    100: "rgba(255, 255, 255, 0.64)",
                    200: "rgba(255, 255, 255, 1)",
                },
                brand: {
                    100: "#4F5EEE",
                    "100-1": "rgba(79, 94, 238, 0.1)",
                    "100-4": "rgba(79, 94, 238, 0.04)",
                    200: "#4453D1",
                },
                gray: {
                    100: "rgba(47, 47, 62, 0.32)",
                    200: "rgba(47, 47, 62, 0.12)",
                },
                mint: {
                    100: "rgba(246, 248, 250, 1)",
                },
                purple: {
                    100: "#5641E0",
                },
            },
            borderWidth: {
                1.5: "1.5px",
            },
            typography: theme => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.brand.100"),
                    },
                },
            }),
            gridTemplateColumns: {
                privateLayout: "85px 1fr",
                constructor: "repeat(12, minmax(0, 1fr)) 40px",
                frAutoFr: "1fr auto 1fr",
            },
            gridTemplateRows: {
                tablePage: "60px auto",
                innerPage: "64px auto",
                innerPageLayout: "auto minmax(0, 1fr)",
                createOrderContentLayout: "repeat(2, auto auto) 1fr",
                frAuto: "1fr auto",
                autoFr: "auto 1fr",
            },
            minWidth: {
                "1/2": "50%",
                "1/3": "33%",
                "1/4": "25%",
                32: "8rem",
                "3xl": "768px",
            },
            maxWidth: {
                400: "400px",
                120: "120px",
                "2/5": "40%",
            },
            minHeight: {
                10: "2.5rem",
                14: "56px",
                20: "80px",
                32: "128px",
                52: "13rem",
            },
            maxHeight: {
                "5/6": "83.33%",
                9999: "9999px",
                createOrderFirstStep: "calc(100% - 25rem)",
            },
            height: {
                tableBody: "calc(100% - 60px)",
                accordionsBody: "calc(100% - 125px)",
                createOrderSecondStep: "calc(100% - 320px)",
                menu: "calc(100% - 57px)",
            },
            boxShadow: {
                dropdown: "0px 0px 20px 0px rgba(0, 0, 0, 0.16)",
                "menu-dropdown": "0px 0px 6px -1px rgba(0, 0, 0, 0.3)",
                "card-shadow": "0px 6px 20px 0px rgba(0, 0, 0, 0.06)",
                menu: "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 6px 20px 0px rgba(0, 0, 0, 0.06)",
                datepicker: "0px 4px 12px 0px rgba(0, 0, 0, 0.2)",
                "table-row": "0px 0.5px 0px 0px rgba(7, 23, 48, 0.24)",
                "breadcrumb-divider": "0px 0.5px 0px 0px rgba(7, 23, 48, 0.24)",
                "table-pagination": "0px -0.5px 0px 0px rgba(7, 23, 48, 0.24)",
                "option-dnd": "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 16px rgba(0, 0, 0, 0.08)",
                "dashboard-card": "0px 4px 12px rgba(0, 0, 0, 0.08)",
            },
            flexBasis: {
                137: "37rem",
            },
            ringWidth: {
                0.5: "0.5px",
                1.5: "1.5px",
            },
            textDecorationThickness: {
                0.5: "0.5px",
            },
            spacing: {
                6.5: "26px",
                18: "66px",
                58: "226px",
                menu: "57px",
            },
            animation: {
                groupBounce: "groupBounce 1s ease-in-out",
            },
            keyframes: {
                groupBounce: {
                    "0%, 100%": {
                        transform: "translateY(0)",
                        background: "white",
                        "animation-timing-function": "ease-in-out",
                    },
                    "50%": {
                        transform: "translateY(-10%)",
                        background: "rgba(79, 94, 238, 0.2)",
                        "animation-timing-function": "ease-in-out",
                    },
                },
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
};
