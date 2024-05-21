document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('transportForm');

  if (!form) {
    return null
  }
  const seriaPassport = document.getElementById('seriaPassport');
  const numberPassport = document.getElementById('numberPassport');
  const whenIssued = document.getElementById('whenIssued');
  const fullName = document.getElementById('FullName');
  const gosNumber = document.getElementById('gosNumber');
  const dateInput = document.getElementById('date');
  const calendarIcon = document.querySelector('.form__icon'); // Выбираем иконку календаря


  // Инициализация календаря Flatpickr
  const calendar = flatpickr(dateInput, {
    enableTime: false, // Отключаем выбор времени
    dateFormat: 'd.m.Y', // Формат даты: день.месяц.год
    locale: 'ru', // Устанавливаем русский язык
    onClose: () => {
      dateInput.dispatchEvent(new Event('input')); // Вызываем событие input при закрытии календаря
    }
  });

  // Показываем календарь при клике на иконку календаря
  calendarIcon.addEventListener('click', () => {
    calendar.open();
  });


  // Применяем маску ввода к whenIssued
  whenIssued.addEventListener('input', (event) => {
    const inputValue = event.target.value.replace(/\D/g, '').slice(0, 8);
    const day = inputValue.slice(0, 2);
    const month = inputValue.slice(2, 4);
    const year = inputValue.slice(4, 8);

    if (inputValue.length <= 2) {
      event.target.value = inputValue;
    } else if (inputValue.length <= 4) {
      event.target.value = `${day}.${month}`;
    } else {
      event.target.value = `${day}.${month}.${year}`;
    }
  });

  // Валидация поля fullName на формат "Иван Иванов Иванович" без цифр
  fullName.addEventListener('input', (event) => {
    const words = event.target.value.trim().split(' ');
    const hasDigits = /\d/.test(event.target.value);
    if (words.length === 3 && !hasDigits) {
      event.target.classList.remove('form__input--error');
    } else {
      event.target.classList.add('form__input--error');
    }
  });

  // Добавляем слушатель событий для валидации gosNumber
  gosNumber.addEventListener('input', () => {
    let inputValue = gosNumber.value.trim();
    inputValue = inputValue.toUpperCase(); // Преобразуем значение в верхний регистр
    const isValid = /^[А-Я]{1}\d{3}[А-Я]{2}$/.test(inputValue);

    if (isValid) {
      gosNumber.classList.remove('form__input--error');
    } else {
      gosNumber.classList.add('form__input--error');
    }

    gosNumber.value = inputValue; // Обновляем значение в поле
  });

  // Сохранение данных формы в локальное хранилище при изменении
  loadFormData();

  // Слушаем событие "input" на форме и вызываем функцию saveFormData(),
  // чтобы сохранить данные формы в локальное хранилище при каждом изменении ввода.
  form.addEventListener('input', () => {
    saveFormData();
  });

  // Валидация формы при отправке
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
      alert('Форма успешно отправлена!');
      localStorage.clear(); // Clear storage after successful submission
      form.reset(); // Reset form fields
    } else {
      alert('Пожалуйста, заполните все поля корректно.');
    }
  });

  // Очистка данных формы и локального хранилища при сбросе формы
  form.addEventListener('reset', () => {
    localStorage.clear();
    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      input.classList.remove('form__input--error');
    });
  });

  // Validate seriaPassport and numberPassport input
  seriaPassport.addEventListener('input', () => {
    seriaPassport.value = seriaPassport.value.replace(/[^0-9]/g, '').slice(0, 4);
  });

  numberPassport.addEventListener('input', () => {
    numberPassport.value = numberPassport.value.replace(/[^0-9]/g, '').slice(0, 6);
  });

  // Функция валидации формы перед отправкой
  function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      if (input.value.trim() === '' ||
        (input === seriaPassport && input.value.length !== 4) ||
        (input === numberPassport && input.value.length !== 6) ||
        (input === whenIssued && !/^\d{2}\.\d{2}\.\d{4}$/.test(input.value)) ||
        (input === fullName && (input.value.trim().split(' ').length !== 3 || /\d/.test(input.value))) ||
        (input === gosNumber && !/^[А-Я]{1}\d{3}[А-Я]{2}$/.test(input.value.trim().toUpperCase()))) {
        input.classList.add('form__input--error');
        isValid = false;
      } else {
        input.classList.remove('form__input--error');
      }
    });
    return isValid;
  }

  // Функция сохранения данных формы в локальное хранилище
  function saveFormData() {
    const formData = {};
    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      formData[input.id] = input.value;
    });
    localStorage.setItem('formData', JSON.stringify(formData));
  }

  // Функция загрузки данных из локального хранилища
  function loadFormData() {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      const formData = JSON.parse(storedData);
      for (const id in formData) {
        const input = document.getElementById(id);
        if (input) {
          input.value = formData[id];
        }
      }
    }
  }
});
