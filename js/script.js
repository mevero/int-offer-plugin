const serverURL = 'https://xlsx.bpc-dev.pl';
const citySelect = document.querySelector("#city");
const streetsSelect = document.querySelector("#streets");
const numbersSelect = document.querySelector("#numbers");

const streetsWrapper = document.querySelector('.streets__wrapper');
const numbersWrapper = document.querySelector('.numbers__wrapper');
const lastStep = document.querySelector('.special-offer__last-step');

const inputCity = document.querySelector('#input-city');
const inputStreets = document.querySelector('#input-streets');
const internetSlider = jQuery('.internet-slider');
const tvSlider = jQuery('.tv-slider');

let internetSlides = 0;
let tvSlides = 1;

const sliderConfig = {infinite: false};

fetch(`${serverURL}/cities`)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((el) => {
            const option = document.createElement("option");
            option.appendChild(document.createTextNode(el.city));
            option.value = el.city;
            citySelect.appendChild(option);
        });
    });

const selectStreets = function (city) {
    fetch(`${serverURL}/streets/${city}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length == 0) {
                console.log('nieprawidłowa nazwa ulicy');
                return false;
            }

            disableElement(inputCity);
            if (data.length == 1) {
                getNumbers(inputCity.value, 'null');
                streetsWrapper.style.display = 'none';
            } else {
                streetsWrapper.style.display = 'block';
                document.querySelector('#streets').innerHTML =
                    "<option disabled selected value> -- select -- </option>";
                data.forEach((el) => {
                    const option = document.createElement("option");
                    option.appendChild(document.createTextNode(el.street));
                    option.value = el.street;
                    document.querySelector('#streets').appendChild(option);
                });
            }
        });
};

const getNumbers = function (city, street) {
    let numberUrls = `${serverURL}/numbers/${city}/${street}`

    fetch(numberUrls)
        .then((res) => res.json())
        .then((data) => {
            if (data.length == 0) {
                return false;
            }
            disableElement(inputStreets);
            numbersWrapper.style.display = 'block';
            numbersSelect.innerHTML =
                "<option disabled selected value> -- select -- </option>";
            data.forEach((el) => {
                const option = document.createElement("option");
                option.setAttribute('data-id', el.id);
                option.appendChild(document.createTextNode(el.number));
                option.value = el.number;
                numbersSelect.appendChild(option);
            });
        });
};

inputCity.addEventListener("change", (el) => {

    if (el.target.value === '') {
        return false;
    }
    selectStreets(el.target.value);
});

inputStreets.addEventListener("change", () => {

    getNumbers(inputCity.value, inputStreets.value);
});

numbersSelect.addEventListener("change", () => {
    disableElement(numbersSelect)

    lastStep.style.display = 'block';
    jQuery('.summary').slideDown();
    document.querySelector('#city-form').value = inputCity.value;
    document.querySelector('#street-form').value = inputStreets.value;
    document.querySelector('#number-form').value = numbersSelect.value;
});

document.querySelector('#bpc-reset').addEventListener('click', function () {
    document.querySelector('form').reset();
    inputCity.value = '';
    inputStreets.value = '';
    numbersSelect.value = '';
    inputCity.disabled = false;
    inputStreets.disabled = false;
    numbersSelect.disabled = false;

    removeSlides('internet-slider', 0, internetSlides);
    removeSlides('tv-slider', 1, tvSlides);

    streetsWrapper.style.display = 'none';
    numbersWrapper.style.display = 'none';
    jQuery('#bpc-reset').hide();
    jQuery('.summary').hide();


})

function disableElement(element) {
    element.disabled = true;
    jQuery('#bpc-reset').show();
}


function check_data(obj) {
    let uid = obj.options[obj.selectedIndex].getAttribute('data-id');
    getRecord(uid);
}

function getRecord(id) {
    let dataUrl = `${serverURL}/data/${id}`

    fetch(dataUrl)
        .then((res) => res.json())
        .then(data => {
            setSliders(data)
        })
}

function setSliders(data) {
    const internetOfferNames = ['htk-fiber', 'popc-fiber', 'htk-radio', 'popc-radio'];
    const tvOfferNames = ['iptv', 'dvbc'];

    if (internetSlides > 0) {
        removeSlides('internet-slider', 0, internetSlides);
    }

    if (tvSlides > 1) {
        removeSlides('tv-slider', 1, tvSlides);
    }

    internetOfferNames.forEach((el) => {
        for (let c = 1; c < 6; c++) {
            if (data[`name-${el}-${c}`] !== '0') {
                internetSlides++;
                addInternetSlide(data[`name-${el}-${c}`], data[`price-${el}-${c}`], data[`speed-${el}-${c}`]);
            }
        }
    });

    tvOfferNames.forEach((el) => {
        for (let c = 1; c < 3; c++) {
            if (data[`name-${el}-${c}`] !== '0') {
                tvSlides++;
                addTvSlide(data[`name-${el}-${c}`], data[`price-${el}-${c}`], data[`chanels-${el}-${c}`]);
            }
        }
    });

    tvOfferNames.forEach((el) => {
        for (let c = 3; c < 6; c++) {
            if (data[`name-${el}-${c}`] !== '0') {
                tvSlides++;
                setAdditionalOffer(data[`name-${el}-${c}`], data[`price-${el}-${c}`], data[`chanels-${el}-${c}`]);
            }
        }
    });

    setTv(0)
    setInternet(0)
}

internetSlider.slick(sliderConfig);
tvSlider.slick(sliderConfig);

function addInternetSlide(name, price, speed) {
    internetSlider.slick('slickAdd', `
      <div class="single-slide">
        <h2 class="single-slide__title">Internet <span class="internet-name">${name}</span></h2>
        <h3 class="single-slide__subtitle"><span class="internet-speed">${speed.replace('/', ' Mbps / ')} Mbps</span> </h3>
        <h3 class="single-slide__price"><span class="internet-price">${price}</span> PLN</h3>
      </div>
    `);
}

function removeSlides(slider, offset, slides) {
    const currentSlider = jQuery(`.${slider}`);

    if (slider == 'tv-slider') {
        currentSlider.slick('slickRemove', 1);
        currentSlider.slick('slickRemove', 0);
    } else {
        for (let i = 0; i < (slides - offset); i++) {
            currentSlider.slick('slickRemove', i);
        }
    }
}

function addTvSlide(name, price, count) {
    tvSlider.slick('slickAdd', `
    <div class="single-slide">
        <h2 class="single-slide__title">Telewizja <span class="tv-name">${name}</span></h2>
        <h3 class="single-slide__subtitle">Liczba kanałów w pakiecie: <span class="tv-chanels">${count}</span></h3>
        <h3 class="single-slide__price"><span class="tv-price">${price}</span> PLN</h3>
    </div> 
    `, true);
}

function setAdditionalOffer(name, price, count) {
    let content = `
        <div class="additional-offer" data-name="${name}" data-price="${price}">
        <strong>${name}</strong>
        <span>liczba kanałów: ${count}</span>
        <span>${price} zł</span>
        </div>
    `;
    jQuery('.additionals-offer').append(content);
}

function setInternet(slide) {
    const currentSlider = jQuery(`.internet-slider .slick-active`);
    const name = currentSlider.find('.internet-name').text();
    const price = parseFloat(currentSlider.find('.internet-price').text());
    const speed = currentSlider.find('.internet-speed').text();
    jQuery('#internet').val(name);
    let total = (parseFloat(currentSlider.find('.internet-price').text()) + parseFloat(jQuery('.tv-slider .slick-active').find('.tv-price').text())).toFixed(2);
    jQuery('.total__price').text(total);
}

function setTv(slide) {
    const currentSlider = jQuery(`.tv-slider .slick-active`);
    const name = currentSlider.find('.tv-name').text();
    const price = parseFloat(currentSlider.find('.tv-price').text());
    const chanels = currentSlider.find('.tv-chanels').text();
    jQuery('#tv').val(name);
    let total = (parseFloat(jQuery('.internet-slider .slick-active').find('.internet-price').text()) + parseFloat(currentSlider.find('.tv-price').text())).toFixed(2);
    jQuery('.total__price').text(total);

}

internetSlider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
    setInternet(currentSlide)
});

tvSlider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
    setTv(currentSlide)
    jQuery('.additional-offer').removeClass('active');
    if (currentSlide == 2) {
        jQuery('.additionals-offer').hide();
    } else {
        jQuery('.additionals-offer').show();
    }
});

jQuery('.additionals-offer').on('click', '.additional-offer', function () {
    let price = parseFloat(jQuery(this).data('price'));
    let totalPrice = parseFloat(jQuery('.total__price').text());
    let offers = '';


    if (jQuery(this).hasClass('active')) {
        jQuery(this).removeClass('active');
        jQuery('.total__price').text((totalPrice - price).toFixed(2))
    } else {
        jQuery(this).addClass('active');
        jQuery('.total__price').text((totalPrice + price).toFixed(2))
    }

    jQuery('.additional-offer.active').each(function () {
        offers += jQuery(this).data('name') + ' ';
    })
    console.log(offers);
    jQuery('#oferty').val(offers)
})
