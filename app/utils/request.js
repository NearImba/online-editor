export default function request (params) {
    const { url, data, method = "post" } = params;
    return fetch(`//${window.location.hostname}:2333${url}`, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }).then(res => res.json());
}
