
// SIGNUP
export const signup = (user) => {
    const API = process.env.REACT_APP_API_URL;
    return fetch(`${API}/api/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => {
            console.log(err)
        })
}

// SIGNIN
export const signin = (user) => {
    const API = process.env.REACT_APP_API_URL;
    return fetch(`${API}/api/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => {
            console.log(err)
        })
}

// AUTHENTICATE AND STORE IN LOCAL STORAGE
export const authenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data))
        next()
    }
}

// REDIRECT USER ACCORDING TO ROLE
export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false
    }
}

// LOGOUT
export const signout = (next) => {
    const API = process.env.REACT_APP_API_URL;
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt", JSON.stringify("jwt"))
        next()
        return fetch(`${API}/api/signout`, {
            method: "POST",
        })
            .then((res) => {
                console.log("signout", res)
            })
            .catch((err) => console.log(err))
    }
}

// FORGOT PASSWORD
export const ForgotPassword = (email) => {
    const API = process.env.REACT_APP_API_URL;
    return fetch(`${API}/api/forgetpassword`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => {
            console.log(err)
        })
}

// RESET PASSWORD
export const ResetPassword = (password, token) => {
    const API = process.env.REACT_APP_API_URL;
    return fetch(`${API}/api/resetpassword/${token}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    })
        .then(res => res.json())
        .catch(err => {
            console.error(err);
        });
};
