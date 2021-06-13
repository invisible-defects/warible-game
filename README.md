# warible-game

## Запуск

- В корне выполнить `yarn`
- В корне выполнить `yarn backend`
- В новом терминале выполнить `yarn frontend`

## Структура проекта

- `packages`
  - `common` - общие файлы, протокол общения сервера игры и клиента на `TypeScript`
  - `backend` - сервер игры на `TypeScript` + `node.js`, общается с клиентом с помощью вебсокетов
  - `frontend` - клиент игры на `TypeScript` + `React` + `Pixi.js`
