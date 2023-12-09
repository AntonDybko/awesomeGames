interface UserProps {
    email: string,
    username: string,
    refreshToken: string,
    password: string,
    picture_url?: string,
    birthday?: Date,
}

export default UserProps;