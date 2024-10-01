const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com";
const LIMIT = 20;
let page = 1;
const display = document.querySelector("#display");
let genres = "";
const getGames = async () => {
  try {
    const search = document.querySelector("#searchForm").value.trim();

    let url = `${BASE_URL}/games?limit=${LIMIT}&page=${page}`;
    if (!!search) {
      url += `&q=${search}`;
      document.querySelector("#searchForm").value = "";
    }
    if (!!genres) {
      url += `&genres=${genres}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.data);
    renderListGame(data.data);
  } catch (error) {
    console.log(error.message);
  }
};
getGames();

document.querySelector("#next").addEventListener("click", () => {
  ++page;
  getGames();
});

document.querySelector("#previous").addEventListener("click", () => {
  if (page <= 1) return;
  --page;
  getGames();
});

const handleClickGenres = (value) => {
  page = 1;
  getGames(value);
};
function dateString(dateStr) {
  const date = new Date(dateStr);

  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
}
const appDetail = async (id) => {
  console.log(id);
  const response = await fetch(`${BASE_URL}/single-game/${id}`);
  const data = await response.json();
  const detail = data.data;
  display.innerHTML = `<div>
  <div class="showing_game show_detail">
    <div class="title_contain">
      <div class="title">${detail.name}</div>
      <div class="price">${detail.price}</div>
    </div>
    <div class="img_detail">
      <img src="${detail.header_image}" alt="NBA 2K25" />
      <div class="game_details">
        <div class="game_description">${detail.description}</div>
        <div class="game_informations">
          <p>RECENT REVIEWS: Mixed</p>
          <p>RELEASE DATE: ${dateString(detail.release_date)}</p>
          <p>
            DEVELOPER:
            <a
              href="https://store.steampowered.com/search/?developer=Visual%20Concepts&amp;snr=1_5_9__400"
              >Visual Concepts</a
            >
          </p>
          <p>
            PUBLISHER:
            <a href="https://store.steampowered.com/publisher/2K?snr=1_5_9__400"
              >2K</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  const genreTags = document.createElement("div");
  genreTags.className = "tags_contain";
  const tags = detail.genres;
  let tagHTML = `Popular user-defined tags for this product:
    <div class="tags">`;
  tags.forEach((item) => {
    tagHTML += `<div class="tag">${item}</div>`;
  });
  tagHTML += "</div>";
  genreTags.innerHTML = tagHTML;
  display.appendChild(genreTags);
};
appDetail(570);
const renderListGame = (data) => {
  display.innerHTML = data
    .map((item) => {
      return `<div><div class="game_wrapper">
    <div class="cover" onclick="appDetail(${item["appid"]})">
    <img src="${item["header_image"]}">
    <div class="game_info">
    <p>${item["name"]}</p>
    <p></p>
    </div>
    </div>
    </div></div>`;
    })
    .join("");
};

const handleSearch = () => {
  page = 1;
  genres = "";
  const categoryGroup = document.querySelector(".categoryGroup");
  categoryGroup.querySelectorAll("li.active").forEach((element) => {
    element.classList.remove("active");
  });

  getGames();
};

document
  .querySelector("#store_search_link")
  .addEventListener("click", handleSearch);
document
  .querySelector(".responsive_header_logo")
  .addEventListener("click", handleSearch);

const getGenreGame = (genre) => {
  page = 1;
  genres = genre;
  getGames();
};

const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genres`);
  const data = await response.json();
  console.log(data);
  const categoryGroup = document.querySelector(".categoryGroup");
  categoryGroup.innerHTML = "";
  data.data.forEach((item) => {
    const li = document.createElement("li");
    li.addEventListener("click", (el) => {
      categoryGroup.querySelectorAll("li.active").forEach((element) => {
        element.classList.remove("active");
      });
      getGenreGame(item.name);
      el.target.classList.add("active");
    });
    li.innerHTML = item.name;
    categoryGroup.appendChild(li);
  });
};
getGenres();

console.log("hello");
