# Instructions
Модуль для отображения и работы с конфигурацией, взаимодействующий с <a href="https://github.com/FosterToster/parametrica">Parametrica</a>

```javascript
<Config
  :metaConfig="metaConfig"
  v-model="localConfig"
  :isDev="false"
  :exclude="[]"
  :loading="loading"
  @validate="(v) => showValidate(v)">
</Config>
```
# Installation
```
npm i carbis-config-component
```
```
import { CarbisConfig } from "carbis-config-component";
```
# Table of contents
- [Props](#head-2)
- [Events](#head-3)
- [Slots](#head-4)
- [Example](#head-5)



# <span name="head-2">Props</span>
```
metaConfig          - Объект метаданных конфигурации
value               - Объект данных конфигурации
isDev               - Режим разработчика
exclude             - Список полей, которые не должны отображаться
loading             - Состояние загрузки
defaultOpened       - Список ключей для раскрытия панели по дефолту
```

# <span name="head-3">Events</span>
```
validate           - Событие, происходящее при изменении поля
update             - Событие, которое возвращает объект, содержащий исключительно изменённые поля
```
# <span name="head-4">Slots</span>
Данный модуль позволяет переопределить компонент любого поля, для удобства необходимо перейти в режим разработчика **isDev="true"**
```
[FieldSet]-slot                 - Переопределение компонента FieldSet 
[FieldSet-Field]-slot           - Переопределние поля в FieldSet
[FieldSet.FieldSet-Field]-slot  - Переопределение поля во вложенном FieldSet
[FieldSet]-action-slot          - Переопределение действия в компоненте FieldSet
[FieldSet]-footer-slot          - Переопределение подвала компонента в FieldSet
[FieldSet]-header-slot          - Переопределение верхней части компонента в FieldSet
[Field]-slot                    - Переопределение примтивного поля на верхнем уровне
action-slot                     - Переопределение действия основного компонента настроек
```
При переиспользовании слотов, которые привязаны к Field или FieldSet , вы можете получить аттрибуты 
```
{
  item: [Object, String, Number, Boolean],
  currentKey: String,
  meta: Object,
  relativeKey: String,
  currentKey: String,
  setattr: function (newValue) 
}
```

# <span name="head-5">Example</span>
Примеры использования
```python
from .ext.parametrica import Field, Fieldset, Parametrica, InRange, io

#Let`s define a Server fieldset
class Server(Fieldset):
    host = Field[str](default='0.0.0.0').label('Server address')
    port = Field[int](default=0).label('Server port').rule(InRange(0, 65535))

#Inheritance is also supported
class AuthServer(Server):
    user = Field[str]('admin').label('Username')
    password = Field[str]('P@55\/\/0rd').label('Password').password()

#Finally, define a configuration root
class Config(Parametrica):
    api_server = Field[AuthServer](host="any.api.com", port="443").label('API Server')
    local_server = Field[Server](port=8080).label('Local server')

    #of course, you can define any field in the config root
    deferred_startup = Field[bool](False).label('Start server after 10 secs')

config = Config(io.YAMLFileConfigIO('config.yaml'))
``` 
Далее мы можем получить метаданные конфигурации , вызвав метод ***\_\_metadata\_\_()*** - данные отсюда передаём в ***metaConfig***
Для получения данных конфигурации используем метод ***export()*** - данные отсюда передаём в ***v-model***
```
<Config
  :metaConfig="metaConfig"
  v-model="localConfig"
  :exclude="[]"
  :loading="loading"
  @validate="(v) => showValidate(v)"
>
  <template #api_server-action-slot>
    <v-btn color="primary">Проверить соединение</v-btn>
  </template>
  <template v-slot:action-slot>
    <v-spacer></v-spacer>
    <v-btn @click="updateConfig(localConfig)" class="primary"
      >Сохранить</v-btn
    >
  </template>
</Config>
```
В данном примере мы переопределяем action-slot у основного компонента и у FieldSet'а AuthServer
Для удобства разработки необходимо переключить компонент в режим разработки, передав параметр isDev="true", что даёт возможность увидеть слоты, которые можно переиспользовать
Если нам необходимо скрыть поле, например ***deferred_startup*** мы передаём в поле ***:exclude="['deferred_startup']"***


