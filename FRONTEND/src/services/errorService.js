export const getErrors = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/errors");
    if (!res.ok) throw new Error("Error fetching");
    return await res.json();
  } catch (err) {
    console.error("Error fetching errors:", err);
    return [];
  }
};
