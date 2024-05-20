const outputArea = document.getElementById("output");
const inputArea = document.getElementById("input_textarea");
const loaderContainer = document.getElementById("loader_container");
const datadiv = document.querySelector("#similar_movies .accordion");
const simh = document.querySelector(".headingsim");
const clearBtn = document.getElementById("clearbtn");
const collapseAllBtn = document.getElementById("collapse-all");

let isEventListenerAdded = false;

autosize(inputArea);

function resizeTextarea(height) {
  inputArea.style.maxHeight = height + "vh";
  autosize.update(inputArea);
}

const focusoutAction = () => {
  setTimeout(() => {
    if (!(datadiv.innerHTML === '')) {
      resizeTextarea("10");
    }
  }, 300);
}

const focusAction = () => {
  if (!(datadiv.innerHTML === '')) {
    resizeTextarea("50");
  }
}

function addEventListeners() {
  inputArea.addEventListener("focusout", focusoutAction);
  inputArea.addEventListener("focus", focusAction);
}

function removeEventListeners() {
  console.log("got here");
  inputArea.removeEventListener("focusout", focusoutAction);
  inputArea.removeEventListener("focus", focusAction);
}


clearBtn.addEventListener("click", () => {
  datadiv.innerHTML = '';
  // inputArea.value = '';
  outputArea.innerHTML = '';
  simh.style.display = "none";
  simh.classList.remove("domvisible");
  clearBtn.parentElement.classList.remove("domvisible");
  autosize.update(inputArea);
  removeEventListeners();
  resizeTextarea("50");
});

  
const collapseAll = () => {
  const accordionItems = document.querySelectorAll('.accordion-collapse');
  accordionItems.forEach((item) => {
    const bsCollapse = new bootstrap.Collapse(item, {
      toggle: false,
    });
    bsCollapse.hide();
  });
};

const expandAll = () => {
  const accordionItems = document.querySelectorAll('.accordion-collapse');
  accordionItems.forEach((item) => {
    const bsCollapse = new bootstrap.Collapse(item, {
      toggle: false,
    });
    bsCollapse.show();
  });
};

const toggleAll = () => {
  collapseAllBtn.classList.toggle("rotate");
  const accordionItems = document.querySelectorAll('.accordion-collapse');
  const accordionItemsArray = Array.from(accordionItems);
  const isExpanded = accordionItemsArray.some((item) => item.classList.contains('show'));

  if (isExpanded) {
    collapseAll();
  } else {
    expandAll();
  }
};
collapseAllBtn.addEventListener("click", toggleAll);


const submitButtons = document.querySelectorAll('button[type="submit"]');
for (let i = 0; i < submitButtons.length; i++) {
  submitButtons[i].addEventListener("mouseenter", () => {
    console.log("capturing");
    removeEventListeners();
  }, true);
  submitButtons[i].addEventListener("mouseleave", () => {
    console.log("capturing2");
    addEventListeners();
  }, true);
}

var mo = false
inputArea.addEventListener("mouseenter", () => {
  mo = true;
});

inputArea.addEventListener("mouseleave", () => {
  mo = false;
});


document.getElementById("predict_form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission
  simh.style.display = "block";
  setTimeout(() => {
    inputArea.focus();
  }, 70);

  // Collect form data
  const formData = new FormData(this);

  // Send POST request using fetch API
  if (inputArea.value.length >= 200) {
    loaderContainer.innerHTML += '<span class="loader"></span>';
    outputArea.innerHTML = '';
    fetch(hobURL, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        outputArea.innerHTML = "";
        if (data.output === "1") {
          confettiCall();
          outputArea.innerHTML += `<div class="fade-text"><div>Hit</div></div>`;
        } else {
          outputArea.innerHTML += `<div class="fade-text"><div>Bust</div></div>`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch(similarURL, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        addEventListeners();
        isEventListenerAdded = true;
        setTimeout(function () {
          if (mo===false){
          inputArea.blur();}
        }, 0);
        simh.classList.add("domvisible");
        clearBtn.parentElement.classList.add("domvisible");
        loaderContainer.innerHTML = '';
        datadiv.innerHTML = '';
        for (let i = 0; i < data.results.distances.length; i++) {
          const accordionItem = document.createElement("div");
          accordionItem.classList.add("accordion-item");
          const accordionHeader = document.createElement("h2");
          accordionHeader.classList.add("accordion-header");
          const accordionButton = document.createElement("button");
          accordionButton.classList.add("accordion-button");
          accordionButton.setAttribute("data-bs-toggle", "collapse");
          accordionButton.setAttribute("type", "button");
          accordionButton.setAttribute("data-bs-target", `#panel${i}`);
          accordionButton.setAttribute("aria-expanded", "true");
          accordionButton.setAttribute("aria-controls", `panel${i}`);
          accordionButton.innerHTML = data.results.titles[i];
          const accordionDiv = document.createElement("div");
          accordionDiv.id = `panel${i}`;
          accordionDiv.classList.add("accordion-collapse", "collapse", "show");
          const accordionBody = document.createElement("div");
          accordionBody.classList.add("accordion-body");
          accordionBody.innerHTML = data.results.plots[i];
          accordionHeader.appendChild(accordionButton);
          accordionDiv.appendChild(accordionBody);
          accordionItem.appendChild(accordionHeader);
          accordionItem.appendChild(accordionDiv);
          datadiv.appendChild(accordionItem);
        }
      })
      .catch((error) => {
        simh.style.display = "none";
        console.error("Error:", error);
      });
  } else {
    simh.style.display = "none";
    message = "text should be atleast 200 characters.";
    appendAlert(message, "warning");
  }
});



const alertPlaceholder = document.getElementById('alert-container')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  setTimeout(() => {
    alertPlaceholder.removeChild(wrapper);
  }, 5000);
}


function confettiCall() {
  const count = 50,
    defaults = {
      angle: 180,
      origin: { y: 0.5, x: 1 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function handleMutation(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
          console.log("Dynamically added div detected!");
          const output = document.getElementById("output");
          const fadeText = document.querySelector(".fade-text");
          setTimeout(function () {
            fadeText.classList.add("fade-in");
          }, 500);
        }
      }
    }
  }
}

// Create a MutationObserver instance
const observer = new MutationObserver(handleMutation);

// Start observing the container div for changes
observer.observe(document.getElementById("output"), { childList: true });