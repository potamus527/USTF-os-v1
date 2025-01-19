const desktop = document.querySelector(".desktop");
const desktopIcons = document.querySelector(".desktop-icons");
const taskbarItems = document.querySelector(".taskbar-items");
const startButton = document.querySelector(".start-button");

let windowIdCounter = 0;
let windows = {}; // Store window data using a map

// Function to fetch the content of an external HTML file
async function fetchHtmlContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching HTML content:", error);
    return "<p>Error loading content.</p>";
  }
}

// Array of app configurations
const apps = [
  {
    id: "app1",
    title: "Flare",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXbyLvTsuIde58Q20O__YkT8Ry6ASkZKrfJQ&s",
    contentUrl: "https://raw.githubusercontent.com/potamus527/USTF-os-v1/refs/heads/main/flare.html",
    content: null,
  },
  {
    id: "app2",
    title: "Day Sketch",
    icon: "https://media.istockphoto.com/id/1459465959/vector/stack-of-paper-icon-vector-design-template-in-white-background.jpg?s=612x612&w=0&k=20&c=19M-hAGtkAiDDoxktEkRAjgs_bii-U3bJntdfFpred0=",
    content: "https://raw.githubusercontent.com/potamus527/USTF-os-v1/refs/heads/main/day_sketch.html",
  },
  {
    id: "app3",
    title: "Wolf Hill",
    icon: "data:image/png;base64,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",
    content: "https://raw.githubusercontent.com/potamus527/USTF-os-v1/refs/heads/main/wold_hill.html",
  },
  {
    id: "app4",
    title: "Calculator",
    icon: "data:image/png;base64,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",
    contentUrl: "https://raw.githubusercontent.com/potamus527/USTF-os-v1/refs/heads/main/calculator.html",
  },
];

async function createWindow(title, content, appId) {
  const windowId = `window-${windowIdCounter++}`;

  const windowDiv = document.createElement("div");
  windowDiv.classList.add("window");
  windowDiv.id = windowId;
  windowDiv.dataset.appId = appId;

  // Title Bar
  const titleBar = document.createElement("div");
  titleBar.classList.add("window-titlebar");

  const titleSpan = document.createElement("span");
  titleSpan.classList.add("window-title");
  titleSpan.textContent = title;

  const controls = document.createElement("div");
  controls.classList.add("window-controls");

  const closeButton = document.createElement("button");
  closeButton.classList.add("window-control-button");
  closeButton.textContent = "X";
  const minimizeButton = document.createElement("button");
  minimizeButton.classList.add("window-control-button");
  minimizeButton.textContent = "-";

  // Window Content (iframe)
  const contentIframe = document.createElement("iframe");
  contentIframe.classList.add("window-content");
  contentIframe.style.width = "100%";
  contentIframe.style.height = "100%";
  contentIframe.style.border = "none";
  contentIframe.src = content;

  //Event Listeners
  const closeHandler = () => closeWindow(windowId);
  const minimizeHandler = () => minimizeWindow(windowId);
  const focusHandler = () => focusWindow(windowId);
  closeButton.addEventListener("click", closeHandler);
  minimizeButton.addEventListener("click", minimizeHandler);
  windowDiv.addEventListener("mousedown", focusHandler);

  controls.appendChild(minimizeButton);
  controls.appendChild(closeButton);
  titleBar.appendChild(titleSpan);
  titleBar.appendChild(controls);
  windowDiv.appendChild(titleBar);
  windowDiv.appendChild(contentIframe);

  // Initial position (you can make this random)
  const x = Math.random() * (desktop.offsetWidth - 350);
  const y = Math.random() * (desktop.offsetHeight - 250);
  windowDiv.style.left = x + "px";
  windowDiv.style.top = y + "px";

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  // Drag event listeners
  const dragStart = (e) => {
    if (e.target.classList.contains("window-control-button")) return;
    isDragging = true;
    offsetX = e.clientX - windowDiv.offsetLeft;
    offsetY = e.clientY - windowDiv.offsetTop;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    windowDiv.style.left = e.clientX - offsetX + "px";
    windowDiv.style.top = e.clientY - offsetY + "px";
  };

  const dragEnd = () => {
    isDragging = false;
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
  };

  titleBar.addEventListener("mousedown", dragStart);
  desktop.appendChild(windowDiv);

  // Add resize handles
  const resizeNW = document.createElement("div");
  resizeNW.classList.add("window-resize", "window-resize-nw");

  const resizeNE = document.createElement("div");
  resizeNE.classList.add("window-resize", "window-resize-ne");

  const resizeSW = document.createElement("div");
  resizeSW.classList.add("window-resize", "window-resize-sw");

  const resizeSE = document.createElement("div");
  resizeSE.classList.add("window-resize", "window-resize-se");

  windowDiv.appendChild(resizeNW);
  windowDiv.appendChild(resizeNE);
  windowDiv.appendChild(resizeSW);
  windowDiv.appendChild(resizeSE);

  //Resizing logic
  let isResizing = false;
  let currentResizeHandle = null;
  let initialX, initialY, initialWidth, initialHeight;

  const startResize = (e, handle) => {
    isResizing = true;
    currentResizeHandle = handle;
    initialX = e.clientX;
    initialY = e.clientY;
    initialWidth = windowDiv.offsetWidth;
    initialHeight = windowDiv.offsetHeight;

    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", resizeEnd);
  };

  const resizeMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;

    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newLeft = windowDiv.offsetLeft;
    let newTop = windowDiv.offsetTop;

    switch (currentResizeHandle) {
      case resizeNW:
        newWidth = initialWidth - deltaX;
        newHeight = initialHeight - deltaY;
        newLeft = initialX + deltaX;
        newTop = initialY + deltaY;
        break;
      case resizeNE:
        newWidth = initialWidth + deltaX;
        newHeight = initialHeight - deltaY;
        newTop = initialY + deltaY;
        break;
      case resizeSW:
        newWidth = initialWidth - deltaX;
        newHeight = initialHeight + deltaY;
        newLeft = initialX + deltaX;
        break;
      case resizeSE:
        newWidth = initialWidth + deltaX;
        newHeight = initialHeight + deltaY;
        break;
    }
    //Ensure min dimensions are respected
    if (newWidth > 200 && newHeight > 100) {
      windowDiv.style.width = newWidth + "px";
      windowDiv.style.height = newHeight + "px";
    }

    if (currentResizeHandle === resizeNW || currentResizeHandle === resizeSW) {
      if (newWidth > 200) {
        windowDiv.style.left = newLeft + "px";
      }
    }
    if (currentResizeHandle === resizeNW || currentResizeHandle === resizeNE) {
      if (newHeight > 100) {
        windowDiv.style.top = newTop + "px";
      }
    }
  };

  const resizeEnd = () => {
    isResizing = false;
    document.removeEventListener("mousemove", resizeMove);
    document.removeEventListener("mouseup", resizeEnd);
    currentResizeHandle = null;
  };
  // Start resizing on mousedown events for each resize handle
  resizeNW.addEventListener("mousedown", (e) => startResize(e, resizeNW));
  resizeNE.addEventListener("mousedown", (e) => startResize(e, resizeNE));
  resizeSW.addEventListener("mousedown", (e) => startResize(e, resizeSW));
  resizeSE.addEventListener("mousedown", (e) => startResize(e, resizeSE));

  //Store window data
  windows[windowId] = {
    element: windowDiv,
    title: title,
    appId: appId,
    eventListeners: {
      close: closeHandler,
      minimize: minimizeHandler,
      focus: focusHandler,
      dragStart: dragStart,
      resizeNW: (e) => startResize(e, resizeNW),
      resizeNE: (e) => startResize(e, resizeNE),
      resizeSW: (e) => startResize(e, resizeSW),
      resizeSE: (e) => startResize(e, resizeSE),
    },
  };

  createTaskbarItem(windowId, title);
  focusWindow(windowId);
}

function closeWindow(windowId) {
  const windowData = windows[windowId];
  if (windowData) {
    const windowElement = windowData.element;
    // Remove event listeners
    windowElement.removeEventListener(
      "mousedown",
      windowData.eventListeners.focus
    );
    windowElement
      .querySelector(".window-titlebar")
      .removeEventListener("mousedown", windowData.eventListeners.dragStart);
    windowElement
      .querySelector(".window-control-button:first-child")
      .removeEventListener("click", windowData.eventListeners.minimize);
    windowElement
      .querySelector(".window-control-button:last-child")
      .removeEventListener("click", windowData.eventListeners.close);

    windowElement
      .querySelector(".window-resize-nw")
      .removeEventListener("mousedown", windowData.eventListeners.resizeNW);
    windowElement
      .querySelector(".window-resize-ne")
      .removeEventListener("mousedown", windowData.eventListeners.resizeNE);
    windowElement
      .querySelector(".window-resize-sw")
      .removeEventListener("mousedown", windowData.eventListeners.resizeSW);
    windowElement
      .querySelector(".window-resize-se")
      .removeEventListener("mousedown", windowData.eventListeners.resizeSE);

    // Remove window
    windowElement.remove();

    // Remove taskbar item
    removeTaskbarItem(windowId);

    // Remove entry
    delete windows[windowId];
  }
}

function minimizeWindow(windowId) {
  const windowData = windows[windowId];
  if (windowData) {
    const windowElement = windowData.element;
    windowElement.classList.add("minimized");
    const taskbarItem = document.querySelector(
      `.taskbar-item[data-window-id="${windowId}"]`
    );
    taskbarItem.classList.add("minimized");
  }
}

function focusWindow(windowId) {
  const focusedWindow = windows[windowId];
  if (focusedWindow) {
    Object.values(windows).forEach((windowData) => {
      windowData.element.style.zIndex = 1;
    });
    focusedWindow.element.style.zIndex = 2;
    if (focusedWindow.element.classList.contains("minimized")) {
      focusedWindow.element.classList.remove("minimized");
      const taskbarItem = document.querySelector(
        `.taskbar-item[data-window-id="${windowId}"]`
      );
      taskbarItem.classList.remove("minimized");
    }
  }
}

function createTaskbarItem(windowId, title) {
  const taskbarItem = document.createElement("div");
  taskbarItem.classList.add("taskbar-item");
  taskbarItem.textContent = title;
  taskbarItem.dataset.windowId = windowId;
  taskbarItem.addEventListener("click", () => focusWindow(windowId));
  taskbarItems.appendChild(taskbarItem);
}

function removeTaskbarItem(windowId) {
  const taskbarItem = document.querySelector(
    `.taskbar-item[data-window-id="${windowId}"]`
  );
  if (taskbarItem) {
    taskbarItem.remove();
  }
}

// Function to create desktop icons from app configurations
async function createDesktopIcons() {
  for (const app of apps) {
    if (app.contentUrl) {
      app.content = app.contentUrl;
    }

    const iconDiv = document.createElement("div");
    iconDiv.classList.add("desktop-icon");
    iconDiv.addEventListener("click", () => {
      if (!windows[app.id]) {
        createWindow(app.title, app.content, app.id);
      } else {
        Object.values(windows).forEach((windowData) => {
          if (windowData.appId == app.id) {
            focusWindow(windowData.element.id);
          }
        });
      }
    });

    const iconImg = document.createElement("img");
    iconImg.src = app.icon;
    iconImg.alt = app.title;

    const iconLabel = document.createElement("span");
    iconLabel.textContent = app.title;

    iconDiv.appendChild(iconImg);
    iconDiv.appendChild(iconLabel);
    desktopIcons.appendChild(iconDiv);
  }
}

// Event listener for the start button to add a window on click
startButton.addEventListener("click", () => {
  createWindow(
    "Example window",
    "<p>This is a window created via the start button.</p>",
    `start-${windowIdCounter}` // Unique ID for start button windows
  );
});

createDesktopIcons();
