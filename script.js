let theme = localStorage.getItem("theme");
const themeToggle = document.getElementById("themeToggle");
const usernameInput = document.getElementById("usernameInput");
const searchForm = document.getElementById("searchForm");
const userInfo = document.getElementById("userInfo");
const userCard = document.getElementById("userCard");
const errorMessage = document.getElementById("errorMessage");
const welcomeMessage = document.getElementById("welcomeMessage");
const loadingState = document.getElementById("loadingState");
const searchButton = document.getElementById("searchButton");
const searchText = document.getElementById("searchText");

if (!theme) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  theme = systemDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

if (theme === "dark") {
  document.body.classList.add("dark");
} else {
  document.body.classList.remove("dark");
}

themeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("usernameInput").value;
  if (usernameInput.length > 0) {
    searchButton.disabled = true;
    searchText.innerText = "Search...";
    errorMessage.classList.add("hidden");
    welcomeMessage.classList.add("hidden");
    userCard.classList.add("hidden");
    loadingState.classList.remove("hidden");
    getUser(usernameInput);
  }
});

async function getUser(user) {
  try {
    const response = await fetch(`https://api.github.com/users/${user}`);
    searchButton.disabled = false;
    searchText.innerText = "Search";
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(
        errData.status ? "User not found" : "Failed to fetch user data"
      );
    }
    const data = await response.json();
    userCard.classList.remove("hidden");
    loadingState.classList.add("hidden");
    renderUser(data);
  } catch (err) {
    console.log(err);
    loadingState.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    errorText.innerText = err.message;
  }
}

function renderUser(data) {
  if (data.bio == null) {
    data.bio = "This profile has no bio";
  }
  userInfo.innerHTML = `
    <div class="user-avatar">
        <img
            src="${data.avatar_url}"
            alt="tranleductinh"
            class="avatar"
            onerror="this.src='/diverse-user-avatars.png'"
        />
        </div>
        <div class="user-details">
        <h2 class="user-name">${data.name || data.login}</h2>
        <a
            href="https://github.com/${data.login}"
            target="_blank"
            class="user-username"
            >@${data.login}</a
        >
        <p class="user-bio">${data.bio}</p>
        <div class="user-stats">
            <div class="stat-badge">
                <span class="stat-number">${data.public_repos}</span> Repos
                </div>
                <div class="stat-badge">
                <span class="stat-number">${data.followers}</span> Followers
                </div>
                <div class="stat-badge">
                <span class="stat-number">${data.following}</span> Following
            </div>
        </div>
        <div id="userMeta" class="user-meta">
            <div class="meta-item"><span>Joined ${new Date(
              data.created_at
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}</span></div>      
        </div>
    </div>`;
  const userMeta = document.getElementById("userMeta");
  if (data.location != null) {
    userMeta.innerHTML += `
      <div class="meta-item">
        <span>
            ${data.location}
        </span>
      </div>
      `;
  }
  if (data.blog != "") {
    userMeta.innerHTML += `
    <div class="meta-item">
        <a href="${data.blog} kkkk" target="_blank">
            ${data.blog}
        </a>
    </div>
      `;
  }
  if (data.twitter_username != null) {
    userMeta.innerHTML += `
    <div class="meta-item">
              <a href="https://twitter.com/${data.twitter_username}" target="_blank">
              @${data.twitter_username}
              </a>
            </div>
    `;
  }
}
