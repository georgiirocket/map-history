export const config = {
    apiConfig: {
        rehreshToken: "/api/check-refreshtoken",
        checkNickname: "/api/check-nickname/",
        register: "/api/register",
        login: "/api/login",
        checkAccessToken: "/api/check-accesstoken",
        exit: "/api/exit",
        updUserData: "/api/update-userdata"
    },
    routes: {
        map: '/map',
        register: '/register',
        signIn: '/sign-in',
        about: '/about',
        support: '/support',
        profile: '/profile'
    },
    languages: [
        ['en', 'English'],
        ['uk', 'Ukraine'],
        ['rus', 'Russian']
    ]
}