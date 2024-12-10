export const fetchData = async (
	url: string,
	method = "GET",
	body: any = null
) => {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : null,
		});
		if (response.ok) {
			return response.json();
		}
		if (response.status === 403) {
			localStorage.clear();
			sessionStorage.clear();
		}
		throw new Error(response.statusText);
	} catch (error: any) {
		console.log("🚀 ~ error:", error);
		throw new Error(error.message);
	}
};
