export const config = {
    apiConfig: {
        rehreshToken: "/api/check-refreshtoken",
        checkNickname: "/api/check-nickname/",
        checkLogin: "/api/check-login/",
        register: "/api/register",
        login: "/api/login",
        checkAccessToken: "/api/check-accesstoken",
        exit: "/api/exit",
        updUserData: "/api/update-userdata",
        checkReadyApp: "/api/check-ready",
        uploadAvatar: "/api/file/avatar/upload",
        getImageUrl: "/api/image/url",
        changeImageActive: "/api/image/url/active",
        getImage: "/api/file/getavatar/"
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