"use strict";
/////Modal Window/////
///////////////////////////////////////
// Modal window///////////////////////
//////////////////////////////////////

const modal_handle = document.querySelector(".modal");
const overlay_handle = document.querySelector("button[class ='overlay']");
const modalButtons_handle = document.querySelectorAll(".btn--show-modal");
const closeModalButton_handle = document.querySelector(".btn--close-modal");
let isOpen_modal = false;
//'app state-variable' ('true' if modal is open, 'false'if it is closed)
console.log(modal_handle);
console.log(overlay_handle);
console.log(modalButtons_handle);
console.log(closeModalButton_handle);
console.log(isOpen_modal);
//Accepts true if you want to open modal, and false if you want to close
const open_modal = function (open) {
  if (open === true) {
    //Opening modal
    modal_handle.classList.remove(".hidden");
    modal_handle.class = "modal";
    overlay_handle.classList.remove(".hidden");
    isOpen_modal = true; //after opening we set the value to true
  } else {
    //Closing modal
    modal_handle.classList.add(".hidden");
    //overlay_handle.classList.add(".hidden");
    isOpen_modal = false; //after closing we set the value to false
  }
};
//Opening the modal window///
//Adding event listeners for all buttons that open the modal window
modalButtons_handle.forEach(function (button) {
  button.addEventListener("click", function () {
    open_modal(true); //passing true opens modal
  });
});
//Adding an event listener (click) to the button that closes the modal window
closeModalButton_handle.addEventListener("click", function () {
  open_modal(false); //passing false closes modal
});

//Adding an event listener (keypress), to close modal window on 'Escape' key
window.addEventListener("keydown", function () {
  if (isOpen_modal) {
    //Checks if the state variable 'isOpen_modal'e is true
    open_modal(false); //passing false closes modal
  }
});

//////////////////////////////////////
/////Smooth Scroll Effect////////////
////////////////////////////////////

//Old Javascript version (hardcore method)//
/// Do it when you build the site from scratch ///

//Modern Javascript Version (easy method)//
const navLink_container = document.querySelector(".nav__links");
const section1Coordinates = document.querySelector("#section--1");
navLink_container.addEventListener("click", function (e) {
  e.preventDefault(); //Stops the immediate jump to link
  const id = e.target.getAttribute("href"); //returns href ;#section--1' --> for the first element which is actually a section elements id =' #value'  --Clever, right?
  //Check to make sure the user clicked on the link itself
  if (e.target.classList.contains("nav__link")) {
    const targetElement = document.querySelector(id);
    targetElement.scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////////
////Tabbed component////////////
////////////////////////////////

/////Handles and variables//////
const operations_container = document.querySelector(".operations");
const tab_container = document.querySelector(".operations__tab-container");
const contentElements_handle = document.querySelectorAll(
  ".operations__content"
);
const tabs_handle = document.querySelectorAll(".operations__tab");

////////////Initialization (Hard-coded)/////////
// first content element is active (by default)
contentElements_handle[0].classList.add("operations__content--active");
// first tab element is active (by default)
tabs_handle[0].classList.add("operations__tab--active");

////////////Functions/////////
const removeActiveTabs = function () {
  //removes active class from all tabs
  tabs_handle.forEach(function (tab) {
    tab.classList.remove("operations__tab--active");
  });
};
const removeActiveContent = function () {
  //removes active class from all content elements
  contentElements_handle.forEach(function (content) {
    content.classList.remove("operations__content--active");
  });
};
const resetTabbedComponent = function () {
  removeActiveTabs();
  removeActiveContent();
};
//Adding a click event listener on the parent of the tab-buttons
tab_container.addEventListener("click", function (e) {
  //Checking to make sure the user clicked the buttons, and not the container space between
  if (e.target.classList.contains("operations__tab")) {
    resetTabbedComponent(); //removes all the previously set active classes

    //Grabs the current targeted elements
    const clickedTab = e.target;
    const contentID = e.target.dataset.tab;
    const content = operations_container.querySelector(
      `.operations__content--${contentID}`
    );
    //Sets the active class for the current (target) tab and  content element
    clickedTab.classList.add("operations__tab--active");
    content.classList.add("operations__content--active");
  }
});

/////////////////////////////////////////////
////////Menu fade Animation/////////////////
///////////////////////////////////////////

//(1)Understanding the problem:
//-Make the the logo and all nav-bar fade (opacity 0.5)
//-Except for the element that the user has currently hovered over
//-analyze the navBar structure:
//-<img>, then a separate <ul> with <li><a></a></li> tags
// img class = 'nav__logo', link element class = 'nav__link'

//(2)Divide and conquer
//-Event delegation, set the parent to listen for mouseover/mouseout events
//-Add a guard-clause that allows the event to be handled
//only if the target element is a 'nav__link'

//Handles and variables///
const navBar_handle = document.querySelector(".nav");
const nav_logo = document.querySelector(".nav__logo");

////////////////FUNCTIONS////////////////////////////
//Lowers the opacity of the all of the siblings around the passed element
// if the argument 'fade === true'
const fadeSiblings = function (
  mainElement,
  parentClass,
  siblingClass,
  opacity
) {
  //Get the sibling links, by accessing all elements of the same class
  //From the closest (direct) parent class
  //Note that it returns the MainElement as well!
  const siblings = mainElement
    .closest(parentClass)
    .querySelectorAll(siblingClass);

  //Lower the opacity of all the sibling elements around the mainElement
  siblings.forEach(function (sibling) {
    //Checks to iterate only the siblings that are not  mainElement
    if (sibling !== mainElement) sibling.style.opacity = opacity;
  });
};

/////EVENT LISTENERS//////////////////////////
navBar_handle.addEventListener("mouseover", function (e) {
  console.log(e);
  console.log(e.target);
  //Lowers the opacity of links and logo, if a cursor hovers over a link
  if (e.target.classList.contains("nav__link")) {
    fadeSiblings(e.target, ".nav", ".nav__link", 0.5);
    //Lower the opacity of the logo if a link is hovered over
    nav_logo.style.opacity = 0.5;
  }
});

//Returns opacity when the hover leaves element
navBar_handle.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("nav__link"))
    fadeSiblings(e.target, ".nav", ".nav__link", 1);

  //Return the opacity of the navBar logo;
  nav_logo.style.opacity = 1;
});

///////////////////////////////////
/////Sticky NavBar Menu////////////
///////////////////////////////////

//(1)Understanding the problem
//--We want the nav bar to become fixed on the viewport the moment
//the header content is no longer visible on screen
//--The moment the header is no longer in the range of the viewport
//--The nav bar should appear on screen

//(2) Divide and conquer
//--Get the handles of the header(to know where it is on viewport)
//and navBar (to change the class when it needs to become sticky)
//--Create a IntersectionObserver Observing the header(target-header)
//--Set the observerCallback to check if the header is intersecting
//--Set the observerOptions to the entire document
// and set the threshold to 0. Meaning that when the header is at
// passes through 0% of the viewport (top/start of the viewport)
//The intersection entry will be created
//If entry.isIntersecting is false
//(it means the header is no longer in viewport range)
//which further means, our navBar should become fixed on screen
//For the NavBar to be visible on screen after it becomes fixed
//We need to add the navBar height to the intersection observer
//threshold-margin
const header_handle = document.querySelector(".header");
const nav_height = navBar_handle.getBoundingClientRect().height;

//Declaring observer-callback function
const stickyNavCallback = function (entries, headerObserver) {
  const entry = entries[0];
  if (entry.isIntersecting === false) {
    navBar_handle.classList.add("sticky");
  } else {
    navBar_handle.classList.remove("sticky");
  }
};

//Declaring the observer-Options object
const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${nav_height}px`,
};
//rootMargin: `-${nav_height}px`,
//Decreases the margin of the viewport so that the threshold registers
//earlier (one navBar height) before the threshold would usually be intersected
//We do this if we want our nav bar to appear on the viewport
//when the top of the viewport is as far away from the bottom of
//our first section, as the navBar is tall(height) so that the nav
//would appear fixed on screen, over the bottom of the first section
//(header) and not over the top of our second section (section1)

////Initializing the IntersectionObserver(callback, optionsObject)
const headerObserver = new IntersectionObserver(stickyNavCallback, options);
headerObserver.observe(header_handle);

///////////////////////////////////////
////Revealing sections on scroll///////
//////////////////////////////////////

//--We want to remove the default --> 'section-hidden'
//class on section elements
//--whenever the element intersects (enters into ) our viewport range
//so that it seems to materialize when we scroll to it
//The CSS responsible for the fade in reveal-animation:
/*
.section--hidden {
  opacity: 0;
  transform: translateY(8rem); 
  //This makes the element 8rem lower than it originaly is 
  //when this class is applied
}
  //meaning that when we remove the class, the element seems 
  //to travel up as it returns to its usual opacity.
*/

///Handles///////////////
const sections = document.querySelectorAll(".section");

//By default we hide all sections by assigning them 'section-hidden'class
sections.forEach(function (section) {
  section.classList.add("section--hidden");
});

////observer callback function/////
const loadSection = function (entries, observer) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    //entry.target = is the html element that triggered the threshold
  }
};

////Observer options-object/////
const sectionObserverOptions = {
  root: null,
  threshold: 0.1,
};

////Initializing observer instance////
const observer = new IntersectionObserver(loadSection, sectionObserverOptions);

//Telling our observer to observe all sections in our document
sections.forEach(function (section) {
  observer.observe(section);
});
//

/////////////////////////////////////////
//////////Lazy Loding Images/////////////
/////////////////////////////////////////

//--We have two src links one for a low-res image
//the other for a high res image. The src string for the
//high res image is stored inside a 'data-'attribute

//What we need to do is to load the high res-image, each time
// our image element appears inside the viewport. For this
// we are going to use an Intersection observer set to observe
// all of our lazy-loaded images.

//The structure for the low-res image css
/*
.lazy-img {
  filter: blur(20px);
}
*/
//Note that the image is really low-res, so to hide the hideous
//image quality from the user, we add a filter with  a blur effect
// to make it more aesthetic before it loads.

//The structure for the lazy-loaded html img element
/*
<img
src="img/card-lazy.jpg"         //current low res src 
data-src="img/card.jpg"         //Hi res src 
alt="Credit card"
class="features__img lazy-img"  //'.lazy-img' class
/>
*/

////Variables and handles////
const lazyImages = document.querySelectorAll(".lazy-img");

////functions/////
//Named event-handler
//Declared in order to be able to remove a listener after firing,
//by passing the removeEventListener() the name of this function

///////Intersection Observer///////
//Observer callback//
const lazyLoad = function (entries, lazyImgObserver) {
  const entry = entries[0];

  //load the hi-res image when the element reaches user-viewport
  if (entry.isIntersecting) {
    //Our target element that passed the threshold is the target image
    const targetImage = entry.target;

    //Switching the original img src(lowres) with data-src(hiRes)
    targetImage.src = targetImage.dataset.src;

    //Deletes the blur only after the hi res image fully loaded
    targetImage.addEventListener("load", function () {
      //unblur
      this.classList.remove("lazy-img");
      //Stop observing image, after it has been loaded and unblured
      lazyImgObserver.unobserve(targetImage);
    });
  }
};

////Observer options->object////
const lazyOptions = {
  root: null,
  treshold: 0.1,
  //rootMargin: "200px", //triggers the threshold before the images appear on screen
};

////Intersection Observer instance for the lazy images////
const lazyImgObserver = new IntersectionObserver(lazyLoad, lazyOptions);

//Set the observer to observe all of our lazy image elements
lazyImages.forEach(function (img) {
  lazyImgObserver.observe(img);
});

///////////////////////////////
/////Slider Component/////////
//////////////////////////////

//Related HTML
/*
<!--Image slides -->
<div class="slider">
  <div class="slide"><img src="img/img-1.jpg" alt="Photo 1" /></div>
  <div class="slide"><img src="img/img-2.jpg" alt="Photo 2" /></div>
  <div class="slide"><img src="img/img-3.jpg" alt="Photo 3" /></div>
  <div class="slide"><img src="img/img-4.jpg" alt="Photo 4" /></div>
  <button class="slider__btn slider__btn--left">&larr;</button>
  <button class="slider__btn slider__btn--right">&rarr;</button>
  <div class="dots"></div>
</div>
*/

/*
//The slides are positioned absolutely relative to their "sliders"parent
//From the top left corner fitting with a 100%width 
//This means that all of the slides are stacked on top of each other 
.slide {
  position: absolute; 
  top: 0;
  width: 100%;
  height: 50rem;

  display: flex;
  align-items: center;
  justify-content: center;

  //--THIS creates the animation!
  transition: transform 1s;
}

//Resizes the images in order for them to fit in size to the slide div
.slide > img {
  //--Only for images that have different size than slide 
  width: 100%;
  height: 100%;
  object-fit: cover;
}
*/

//(1)Understanding the problem:
//The <div> slides are stacked one on top of the other
//What we want to happen is to stack them in one horizontal plane
//since, they are absolutely positioned, they will transform: translateX(%)
//Without moving and shifting any other elements on the page
//Being lifted(excempt from the normal layout)

//(2)Divide and conquer
//--get the Node-List of all the 'slide' containers
//--Create a method that adds to all of the elements a
//transform: translateX(%) property with the value set as such
//that the first slide, is in the original position of the slide
// translateX(0%) and every followign slide is offset to the right
// by the length of the 'sliders' contiainer element

//Since the slider element is 100% widht of the parent container
//executing this translation on the horizontal axis can be done
//by shifting each following slider element by an additional 100%
// [0%, 100%, 200%, 300%] --> For four slider elements

///Slider handles///
const sliders = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

////Slider-state variables////
let currentSlideIndex = 0;
const maxSlideIndex = sliders.length - 1;

////Slider-functions////
const goToSlide = function (slideIndex) {
  sliders.forEach(function (slide, i) {
    slide.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
    currentSlideIndex = slideIndex;
  });
};

//Making slider elements visible when programming it//////////////
/*
const slider = document.querySelector(".slider");
slider.style.transform = "scale(0.5) ";
slider.style.overflow = "visible";
*/
////////////////////////////////////////////////////////////////
/////Slider-Dots Component/////
///////////////////////////////

////dot-handles///
const dots_container = document.querySelector(".dots");

/////Dot-functions///////
//Function for creating  as many "dot" class elements as there are slides
const createSliderDots = function (sliders, container) {
  //accepts a node list of slides and
  // a container element to insert html dot templates
  sliders.forEach(function (__, i) {
    dots_container.insertAdjacentHTML(
      "beforeend",
      `<button class ="dots__dot" data-slide = "${i}"></div>`
    );
  });
};

//Function for activating the current dot
//Make sure to call only after the dots have been create
//Otherwise referencing  'dots__dot' will throw a reference error
const activateDot = function (currentSlideIndex) {
  const dots = document.querySelectorAll(".dots__dot");

  //Removing the active class from all the dots
  dots.forEach(function (dot) {
    dot.classList.remove("dots__dot--active");
  });

  //Adding the active class to te dot with the data-slide attribute value
  //corresponding to the currentSlideIndex
  document
    .querySelector(`.dots__dot[data-slide="${currentSlideIndex}"]`)
    .classList.add("dots__dot--active");
};

////////Initializing our Slider and slider dots///////////

//Calling the function to create said dots
createSliderDots(sliders, dots_container);

/////Setting up the slides to stack horizontally
goToSlide(currentSlideIndex);
activateDot(currentSlideIndex);

////Next slide functionality////
btnRight.addEventListener("click", function () {
  //On rightButtonClick the current slide becomes the next slide++
  currentSlideIndex++;
  //If the new currentslide index is a umber above the last slide
  if (currentSlideIndex > maxSlideIndex) {
    goToSlide(0); //returns to the first slide element
    activateDot(currentSlideIndex);
  } else {
    //goes to the next slide
    goToSlide(currentSlideIndex);
    activateDot(currentSlideIndex);
  }
});

////Previous slide functionality////
btnLeft.addEventListener("click", function () {
  //On leftButtonClick the current slide becomes the previous slide--
  currentSlideIndex--;
  //If the new currentSlide index is a number bellow [0]
  if (currentSlideIndex < 0) {
    goToSlide(maxSlideIndex); //goes to the  the last slide element
    activateDot(currentSlideIndex);
  } else {
    //Goes to the previous slide
    goToSlide(currentSlideIndex);
    activateDot(currentSlideIndex);
  }
});

////Dot-click => Go to slide functionality///
dots_container.addEventListener("click", function (e) {
  //guard clause -> returns if the click-target was not a dot
  if (!e.target.classList.contains("dots__dot")) return;

  const slideNumber = e.target.dataset.slide;
  goToSlide(slideNumber);
  activateDot(currentSlideIndex);
});

////Left <- -> right Button press slide navigation////
document.addEventListener("keydown", function (e) {
  console.log(e.key);
  if (e.key === "ArrowRight") {
    if (currentSlideIndex > maxSlideIndex) {
      goToSlide(0); //returns to the first slide element
      activateDot(currentSlideIndex);
    } else {
      //goes to the next slide
      goToSlide(++currentSlideIndex);
      activateDot(currentSlideIndex);
    }
  } else if (e.key === "ArrowLeft") {
    if (currentSlideIndex > maxSlideIndex) {
      goToSlide(0); //returns to the first slide element
      activateDot(currentSlideIndex);
    } else {
      //goes to the next slide
      goToSlide(++currentSlideIndex);
      activateDot(currentSlideIndex);
    }
    goToSlide(--currentSlideIndex);
  }
});
