document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#user-info").addEventListener("submit", () => {
        window.localStorage.setItem('user', document.querySelector("#display-name-value").value);
    });
});


