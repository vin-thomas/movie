output_area = document.getElementById("output");
input_area = document.getElementById("input_textarea");
ldrcntr = document.getElementById("loader_container");
datadiv = document.querySelector("#similar_movies .accordion");
document
  .getElementById("predict_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(this);
    // Send POST request using fetch API
    if (input_area.value.length >= 200) {
      ldrcntr.innerHTML += '<span class="loader"></span>';
      fetch(hobURL, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrf_token,
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
          output_area.innerHTML = "";
          if (data.output == "1") {
            confetti_call();
            output_area.innerHTML += `<div class="fade-text"><div>Hit</div></div>`;
          } else {
            output_area.innerHTML += `<div class="fade-text"><div>Bust</div></div>`;
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });

      fetch(similarURL, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrf_token,
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
          ldrcntr.innerHTML = '';
          datadiv.innerHTML = '';
          for (i = 0; i < data.results.distances.length; i++) {
            accordion_item = document.createElement("div");
            accordion_item.classList.add("accordion-tiem");
            accordion_header = document.createElement("h2");
            accordion_header.classList.add("accordion-header");
            accordion_button = document.createElement("button");
            accordion_button.classList.add("accordion-button");
            accordion_button.setAttribute("data-bs-toggle", "collapse");
            accordion_button.setAttribute("type", "button");
            accordion_button.setAttribute("data-bs-target", `#panel${i}`);
            accordion_button.setAttribute("aria-expanded", "true");
            accordion_button.setAttribute("aria-controls", `tpanel${i}`);
            accordion_button.innerHTML = data.results.titles[i];
            accordion_div = document.createElement("div");
            accordion_div.id = `panel${i}`;
            accordion_div.classList.add(
              "accordion-collapse",
              "collapse",
              "show"
            );
            accordion_body = document.createElement("div");
            accordion_body.classList.add("accordion-body");
            accordion_body.innerHTML = data.results.plots[i];
            accordion_header.appendChild(accordion_button);
            accordion_div.appendChild(accordion_body);
            accordion_item.appendChild(accordion_header);
            accordion_item.appendChild(accordion_div);
            datadiv.appendChild(accordion_item);
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });
    } else {
      if (!document.querySelector(".alert-container").innerHTML.trim()) {
        document.querySelector(
          ".alert-container"
        ).innerHTML += `<div id="noti" class="alert alert-primary alert-dismissible fade show" role="alert"> 
        The text should be at least 200 characters to give a valid prediction
        <button id="alert-close" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
      } else {
        console.log(document.querySelector(".alert-container").innerHTML);
        document.getElementById("noti").classList.add("show");
      }
    }
  });


// if (){}

function confetti_call() {
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
  for (var mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Check if a div has been added
      for (var node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
          console.log("Dynamically added div detected!");
          var output = document.getElementById("output");
          var fadeText = document.querySelector(".fade-text");
          // if (output.classList.contains("settle")) {
          //   output.classList.remove("settle");
          // }
          // Add the fade-in class after a delay
          setTimeout(function () {
            fadeText.classList.add("fade-in");
          }, 500); // Adjust delay as needed

          // Add the fade-out class after a delay
          // setTimeout(function () {
          //   // output.classList.remove("fade-in");
          //   output.classList.add("settle");
          // }, 4000); // Adjust delay as needed
        }
      }
    }
  }
}

// Create a MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing the container div for changes
observer.observe(document.getElementById("output"), { childList: true });


