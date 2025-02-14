// Header
var lastScrollTop = 0;
var header = document.getElementById("header");

window.onscroll = function () {
    var currentScrollTop = document.documentElement.scrollTop;
    if (currentScrollTop < lastScrollTop) {
        header.classList.remove("hide");
    } else if (currentScrollTop > 100) {
        header.classList.add("hide");
    }

    lastScrollTop = currentScrollTop;
};

// Clock
function dateToText(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (minutes < 10) minutes = "0" + minutes;
    if (hours < 10) hours = "0" + hours;
    return hours + ":" + minutes + ":" + seconds;
}

function updateClocks() {
    for (var i = 0; i < window.arrClocks.length; i++) {
        var clock = window.arrClocks[i];
        var offset = window.arrOffsets[i];
        var currentTime = dateToText(new Date(new Date().getTime() + offset));
        clock.innerHTML = `Malaysia | ${currentTime} | GMT+8`;
    }
}

function startClocks() {
    var clockElements = document.getElementsByClassName("clock");
    window.arrClocks = [];
    window.arrOffsets = [];
    for (var i = 0; i < clockElements.length; i++) {
        var el = clockElements[i];
        var timezone = parseInt(el.getAttribute("timezone"));
        if (!isNaN(timezone)) {
            var tzDifference = timezone * 60 + new Date().getTimezoneOffset();
            var offset = tzDifference * 60 * 1000;
            window.arrClocks.push(el);
            window.arrOffsets.push(offset);
        }
    }
    updateClocks();
    setInterval(updateClocks, 1000);
}

setTimeout(startClocks, 100);

// Animations
// Register ScrollTrigger plguin
gsap.registerPlugin(ScrollTrigger);

// Prevent flash of unstyled content before animation loads
gsap.set("[text-anim]", { opacity: 1 });

document.addEventListener("DOMContentLoaded", () => {
    // Split text into words and characters, wrapping them in span tags
    document.querySelectorAll("[text-anim]").forEach((el) => {
        new SplitType(el, {
            types: "words, chars",
            tagName: "span",
        });
    });

    document.querySelectorAll("[text-anim]").forEach((el) => {
        let tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            stagger: { amount: 0.2 },
        });
        tl.play();
        createScrollTrigger(el, tl);
    });
});

function createScrollTrigger(triggerElement, timeline) {
    ScrollTrigger.create({
        trigger: triggerElement,

        start: "top bottom",
        onLeaveBack: () => {
            timeline.progress(0).pause();
        },
    });

    ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 80%",
        onEnter: () => {
            timeline.play();
        },
    });
}
