const BASE_URL =
  "https://join-1bae0-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Stores data in the Firebase Realtime Database.
 * @param {string} [path=""] - The path where the data should be stored.
 * @param {Object} [data={}] - The data that should be stored.
 * @returns {Promise<Object>} - The stored data.
 */
async function setItem(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Retrieves data from the Firebase Realtime Database.
 * @param {string} [path=""] - The path from which the data should be retrieved.
 * @returns {Promise<Object[]>} - The retrieved data or an empty array if no data exists.
 */
async function getItem(path = "") {
  try {
    const url = BASE_URL + path + ".json";
    let response = await fetch(url);
    let data = await response.json();

    return data !== "" && data !== null ? data : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
