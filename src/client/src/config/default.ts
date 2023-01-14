export const config = {
    sizeLimitAvatarFile: 10048576,
    typeAvatarFile: ["image/jpeg", "image/jpg", "image/png"],
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
        getImage: "/api/file/getavatar/",
        getProfileInfo: "/api/profile/info",
        editProfile: "/api/profile/edit",
    },
    routes: {
        map: '/map',
        register: '/register',
        signIn: '/sign-in',
        about: '/about',
        support: '/support',
        profile: '/profile',
        marker: '/map/marker'
    },
    languages: [
        ['en', 'English'],
        ['uk', 'Ukraine'],
        ['rus', 'Russian']
    ]
}