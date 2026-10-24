// ============================================================
//  НАСТРОЙКИ МЕНЮ И САЙТА (правьте через редактор или руками)
//  desc — подпись в кнопках «Пред./След.»; icon — из assets/js/icons.js
// ============================================================
window.DOCS = {
  "name": "LumenSMP",
  "logo": "assets/server-icon.png",
  "label": "Документация LumenSMP",
  "nav": [
    {
      "text": "Главное",
      "href": "main.html",
      "icon": "book",
      "desc": "Основная информация о сервере",
      "open": true,
      "children": [
        {
          "text": "Правила",
          "href": "rules.html",
          "icon": "file",
          "desc": "Все правила сервера"
        },
        {
          "text": "Как зайти",
          "href": "howtojoin.html",
          "icon": "plug",
          "desc": "Всё, что нужно, чтобы зайти на сервер"
        }
      ]
    },
    {
      "text": "Механики и команды",
      "href": "mechanics.html",
      "icon": "blocks",
      "desc": "Основные механики и команды сервера"
    },
    {
      "text": "Lumen+",
      "href": "lumenplus.html",
      "icon": "coins",
      "desc": "Ежемесячная подписка",
      "open": false,
      "children": [
        {
          "text": "Суффикс",
          "href": "suffix.html",
          "desc": "Выделит в чате и табе",
          "icon": "file"
        },
        {
          "text": "Оформление",
          "href": "chatsettings.html",
          "desc": "Цвета чата и системных сообщений"
        },
        {
          "text": "Форматирование текста",
          "href": "format.html",
          "desc": "Смена цвета и стиля текста"
        },
        {
          "text": "Команды",
          "href": "commands.html",
          "desc": "Все команды, которые можно использовать с Lumen+"
        }
      ]
    },
    {
      "href": "index.html",
      "icon": "question",
      "text": "Q&A",
      "desc": "Ответы на вопросы, которые могли появиться"
    }
  ]
};
