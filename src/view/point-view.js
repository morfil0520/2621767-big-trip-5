import AbstractView from '../framework/view/abstract-view.js';
import { formatEventTime, formatEventDate, formatEventDuration } from '../utils.js';

function createPointRouteTemplate(event, destinations, allOffers) {
  const {
    destination = {},
    dateFrom = new Date(),
    dateTo = new Date(),
    price = 0,
    isFavorite = false,
    type = 'flight'
  } = event;

  const eventType = validateEventType(type);
  const eventTypeOffers = allOffers[eventType] || [];

  const selectedOffers = eventTypeOffers.filter((offer) =>
    event.offers.some((id) => id === offer.id)
  );

  function validateEventType(objectType) {
    const validTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    const defaultType = 'flight';

    const normalizedType = String(objectType).toLowerCase();
    return validTypes.includes(normalizedType) ? normalizedType : defaultType;
  }

  const destinationId = typeof destination === 'object' ? destination.id : destination;
  const pointDestination = destinations.find((dest) => dest.id === destinationId);
  const pointDestinationName = pointDestination?.name || 'Unknown city';

  const startDate = formatEventDate(dateFrom);
  const startTime = formatEventTime(dateFrom);
  const endTime = formatEventTime(dateTo);
  const duration = formatEventDuration(dateFrom, dateTo);
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42"
               src="img/icons/${eventType}.png"
               alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${pointDestinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${startTime}</time>
            &mdash;
            <time class="event__end-time">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <ul class="event__selected-offers">
            ${selectedOffers.map((offer) => `
              <li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </li>
            `).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class PointView extends AbstractView {
  #event = null;
  #destinations = null;
  #offers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({ event, destinations, offers, onEditClick, onFavoriteClick }) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#handleEditClick);
    this.element.querySelector('.event__favorite-btn')?.addEventListener('click', this.#handleFavoriteClick);
  }

  get template() {
    return createPointRouteTemplate(this.#event, this.#destinations, this.#offers);
  }

  #handleEditClick = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #handleFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
