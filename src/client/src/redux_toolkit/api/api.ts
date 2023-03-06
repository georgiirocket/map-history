import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { toast } from "react-toastify"
import { SR } from "../../index"
import { globalActions } from "../slices/global"
import {
    ResponseCheckNickname,
    ResponseCheckLogin,
    ResponseDataRegister,
    RequestDataRegister,
    ReqDataSignIn,
    ResponseDataReadyApp,
    ResponseGetImageUrl,
    ChangeActiveAvatar,
    ResRemoveAvatar,
    ResGetProfileInfo,
    ReqUpdateDataProfile
} from "../../models/def_model"
import { CreateMarkerResponse, CreateMarkerRequest } from "../../models/createMarker"
import { config } from "../../config/default"
import { mapActions } from "../slices/map"

interface Res<T> {
    status: 0 | 1,
    data: T,
    error: null | string
}

const baseQuery = fetchBaseQuery({ baseUrl: '/' })
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery({
            url: "/api/check-refreshtoken",
            method: "POST",
            body: {
                refresh_token: SR.get()
            }
        }, api, extraOptions)
        if (refreshResult.error && refreshResult.error.status === 401) {
            api.dispatch(globalActions.setUserData(null))
            api.dispatch(globalActions.setIsAuth(false))
            api.dispatch(globalActions.setGlobalLoadOff())
        } else {
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}

export const mapApi = createApi({
    reducerPath: "map/api",
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        checkNickname: build.query<Res<ResponseCheckNickname>, string>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadCheckNickname(true))
                    const result = await bs({
                        url: config.apiConfig.checkNickname + arg,
                        method: "GET"
                    });
                    api.dispatch(globalActions.setLoadCheckNickname(false))
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    return ({ data: result.data as Res<ResponseCheckNickname> })
                } catch (e) {
                    api.dispatch(globalActions.setLoadCheckNickname(false))
                    toast.error("Failure Request", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        checkLogin: build.query<Res<ResponseCheckLogin>, string>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadCheckLogin(true))
                    const result = await bs({
                        url: config.apiConfig.checkLogin + arg,
                        method: "GET"
                    });
                    api.dispatch(globalActions.setLoadCheckLogin(false))
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    return ({ data: result.data as Res<ResponseCheckLogin> })
                } catch (e) {
                    api.dispatch(globalActions.setLoadCheckLogin(false))
                    toast.error("Failure Request", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        register: build.mutation<Res<ResponseDataRegister>, RequestDataRegister>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadRegister(true))
                    const result = await bs({
                        url: config.apiConfig.register,
                        method: "POST",
                        body: arg
                    });
                    api.dispatch(globalActions.setLoadRegister(false))
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResponseDataRegister>

                    SR.set(resData.data.refresh_token)
                    api.dispatch(globalActions.setUserData(resData.data.userData))
                    api.dispatch(globalActions.setIsAuth(true))
                    api.dispatch(globalActions.setReadyApp(true))

                    return ({ data: resData })
                } catch (e) {
                    api.dispatch(globalActions.setLoadRegister(false))
                    toast.error("Failure Request", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        checkTokenStartApp: build.query<Res<ResponseDataRegister>, void>({
            async queryFn(_arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadCheckToken(true))
                    const result = await bs({
                        url: config.apiConfig.checkAccessToken,
                        method: "GET"
                    });
                    api.dispatch(globalActions.setLoadCheckToken(false))
                    if (result.error) {
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResponseDataRegister>
                    SR.set(resData.data.refresh_token)
                    api.dispatch(globalActions.setUserData(resData.data.userData))
                    api.dispatch(globalActions.setIsAuth(true))

                    return ({ data: resData })
                } catch (e) {
                    api.dispatch(globalActions.setLoadCheckToken(false))
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        exit: build.query<string, void>({
            async queryFn(_arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadCheckToken(true))
                    const result = await bs({
                        url: config.apiConfig.exit,
                        method: "GET"
                    });
                    api.dispatch(globalActions.setLoadCheckToken(false))
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    SR.set("")
                    api.dispatch(globalActions.setUserData(null))
                    api.dispatch(globalActions.setIsAuth(false))

                    return ({ data: "ok" })
                } catch (e) {
                    api.dispatch(globalActions.setLoadCheckToken(false))
                    toast.error("Error server", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        signIn: build.mutation<Res<ResponseDataRegister>, ReqDataSignIn>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadSignIn(true))
                    const result = await bs({
                        url: config.apiConfig.login,
                        method: "POST",
                        body: arg
                    });
                    api.dispatch(globalActions.setLoadSignIn(false))
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResponseDataRegister>

                    SR.set(resData.data.refresh_token)
                    api.dispatch(globalActions.setUserData(resData.data.userData))
                    api.dispatch(globalActions.setIsAuth(true))
                    api.dispatch(globalActions.setReadyApp(true))

                    return ({ data: resData })
                } catch (e) {
                    api.dispatch(globalActions.setLoadSignIn(false))
                    toast.error("Failure Request", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        checkReadyApp: build.query<Res<ResponseDataReadyApp>, void>({
            async queryFn(_arg, api, _extraOptions, bs) {
                try {
                    const result = await bs({
                        url: config.apiConfig.checkReadyApp,
                        method: "GET"
                    });
                    if (result.error) {
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResponseDataReadyApp>
                    api.dispatch(globalActions.setReadyApp(resData.data.ready))
                    return ({ data: resData })
                } catch (e) {
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        uploadAvatar: build.mutation<Res<string>, File>({
            async queryFn(arg, _api, _extraOptions, bs) {
                try {
                    let data = new FormData()
                    console.log(arg)
                    data.append('file', arg)
                    const result = await bs({
                        url: config.apiConfig.uploadAvatar,
                        method: "POST",
                        body: data
                    });
                    if (result.error) {
                        toast.error("Error server", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<string>
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Error server", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        getImageUrl: build.query<Res<ResponseGetImageUrl>, void>({
            async queryFn(_arg, _api, _extraOptions, bs) {
                try {
                    const result = await bs({
                        url: config.apiConfig.getImageUrl,
                        method: "GET"
                    });
                    if (result.error) {
                        toast.error("Get img", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResponseGetImageUrl>
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Get img", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        changeActiveAvatar: build.query<Res<ChangeActiveAvatar>, string>({
            async queryFn(arg = '', _api, _extraOptions, bs) {
                try {
                    const result = await bs({
                        url: config.apiConfig.changeImageActive,
                        method: "GET",
                        params: {
                            active: arg
                        }
                    });
                    if (result.error) {
                        toast.error("Change active avatar", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ChangeActiveAvatar>
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Change active avatar", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        removeAvatar: build.mutation<Res<ResRemoveAvatar>, string>({
            async queryFn(arg = '', _api, _extraOptions, bs) {
                try {
                    const result = await bs({
                        url: config.apiConfig.getImage + arg,
                        method: "DELETE",
                    });
                    if (result.error) {
                        toast.error("Remove avatar", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResRemoveAvatar>
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Remove avatar", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        getProfileInfo: build.query<Res<ResGetProfileInfo>, void>({
            async queryFn(_arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadProfile(true))
                    const result = await bs({
                        url: config.apiConfig.getProfileInfo,
                        method: "GET",
                    });
                    api.dispatch(globalActions.setLoadProfile(false))
                    if (result.error) {
                        toast.error("Get profile info", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResGetProfileInfo>
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Get profile info", { autoClose: 2000 })
                    api.dispatch(globalActions.setLoadProfile(false))
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        updateProfile: build.mutation<Res<ResGetProfileInfo>, ReqUpdateDataProfile>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    api.dispatch(globalActions.setLoadProfile(true))
                    const result = await bs({
                        url: config.apiConfig.editProfile,
                        method: "PUT",
                        body: arg
                    });
                    api.dispatch(globalActions.setLoadProfile(false))
                    if (result.error) {
                        toast.error("Update profile", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as Res<ResGetProfileInfo>

                    return ({ data: resData })
                } catch (e) {
                    toast.error("Update profile", { autoClose: 2000 })
                    api.dispatch(globalActions.setLoadProfile(false))
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),
        createMarker: build.mutation<CreateMarkerResponse, CreateMarkerRequest>({
            async queryFn(arg, api, _extraOptions, bs) {
                try {
                    const formdata = new FormData()
                    arg.photos.forEach(photo => {
                        if (photo.file) {
                            formdata.append("file", photo.file)
                        }
                    })
                    formdata.append("text", JSON.stringify({
                        owner: arg.owner,
                        privat: arg.privat,
                        title: arg.title,
                        description: arg.description,
                        position: arg.position,
                        images: arg.photos.map(p => ({
                            id: p.id,
                            active: p.active,
                            url: p.url
                        }))
                    }))
                    const result = await bs({
                        url: config.apiConfig.createMarker,
                        method: "POST",
                        body: formdata
                    });
                    if (result.error) {
                        toast.error("Create marker", { autoClose: 2000 })
                        return ({
                            error: result.error as FetchBaseQueryError
                        })
                    }
                    let resData = result.data as CreateMarkerResponse
                    api.dispatch(mapActions.setAddMarker(null))
                    api.dispatch(mapActions.setCreateMarkerMod(false))
                    return ({ data: resData })
                } catch (e) {
                    toast.error("Create marker", { autoClose: 2000 })
                    return ({
                        error: e as FetchBaseQueryError
                    })
                }
            },
        }),

    })
})

export const {
    useLazyCheckNicknameQuery,
    useLazyCheckLoginQuery,
    useRegisterMutation,
    useLazyCheckTokenStartAppQuery,
    useCheckTokenStartAppQuery,
    useLazyExitQuery,
    useSignInMutation,
    useCheckReadyAppQuery,
    useUploadAvatarMutation,
    useLazyGetImageUrlQuery,
    useLazyChangeActiveAvatarQuery,
    useRemoveAvatarMutation,
    useLazyGetProfileInfoQuery,
    useUpdateProfileMutation,
    useCreateMarkerMutation
} = mapApi