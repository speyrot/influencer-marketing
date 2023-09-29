// Followers Slider setup
const slider = document.getElementById('follower-slider');
const rangeValuesSpan = document.getElementById('range-values');
const minFollowersValue = document.getElementById('minFollowersValue');
const maxFollowersValue = document.getElementById('maxFollowersValue');

noUiSlider.create(slider, {
    start: [0, 1000000],
    connect: true,
    step: 25000,
    range: {
        'min': 0,
        'max': 1000000
    },
    format: {
        to: function (value) {
            return Math.round(value);
        },
        from: function (value) {
            return Math.round(value);
        }
    }
});

// Age Slider setup
const ageSlider = document.getElementById('age-slider');
const ageRangeValuesSpan = document.getElementById('age-range-values');
const minAgeValue = document.getElementById('minAgeValue');
const maxAgeValue = document.getElementById('maxAgeValue');

noUiSlider.create(ageSlider, {
    start: [0, 100],
    connect: true,
    step: 1,
    range: {
        'min': 0,
        'max': 100
    },
    format: {
        to: function (value) {
            return Math.round(value);
        },
        from: function (value) {
            return Math.round(value);
        }
    }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Display the current value and set hidden inputs for Followers
slider.noUiSlider.on('update', function(values, handle) {
    let minFormatted = numberWithCommas(values[0]);
    let maxFormatted = numberWithCommas(values[1]);
    rangeValuesSpan.textContent = `Followers: ${minFormatted} - ${maxFormatted}`;
    minFollowersValue.value = values[0];
    maxFollowersValue.value = values[1];
});

// Display the current value and set hidden inputs for Age
ageSlider.noUiSlider.on('update', function(values, handle) {
    ageRangeValuesSpan.textContent = `Age: ${values[0]} - ${values[1]}`;
    minAgeValue.value = values[0];
    maxAgeValue.value = values[1];
});



