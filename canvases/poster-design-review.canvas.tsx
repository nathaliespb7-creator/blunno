import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  Callout,
  Pill,
  useHostTheme,
  TodoListCard,
  TodoItem
} from "cursor/canvas";

export default function PosterDesignReview() {
  const theme = useHostTheme();

  // Completed task list
  const reviewTodos: TodoItem[] = [
    {
      id: "1",
      content: "Убрана страница брендбука с логотипами из правого слота коллажа",
      status: "completed"
    },
    {
      id: "2",
      content: "Установлен правильный снимок девочки с укулеле (короткая стрижка, серый жакет)",
      status: "completed"
    },
    {
      id: "3",
      content: "Добавлен новый элемент декора: летний цветок (flower-1) в верхнем левом углу",
      status: "completed"
    },
    {
      id: "4",
      content: "Добавлена новая порция нот (note-3: двойная восьмая) для усиления темы хора",
      status: "completed"
    },
    {
      id: "5",
      content: "Добавлен дополнительный парящий листок (leaf-2) для создания динамики ветра",
      status: "completed"
    },
    {
      id: "6",
      content: "Пересобраны и успешно протестированы форматы Social PNG и A4 PDF",
      status: "completed"
    }
  ];

  return (
    <Stack gap={20} style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Row align="center" justify="space-between">
        <H1 style={{ color: theme.colors.text.primary }}>
          Дизайн-Ревью Афиши Детского Хора
        </H1>
        <Pill active size="md">
          Готово к печати
        </Pill>
      </Row>

      <Callout tone="success" title="Успешное исправление">
        <Text>
          Обнаружена и устранена ошибка подмены ассетов: вместо фотографии девочки с укулеле в правый слот коллажа ошибочно загружалась страница брендбука с техническими логотипами и палитрой Pantone. Теперь афиша выглядит полностью презентабельно и чисто!
        </Text>
      </Callout>

      <H2 style={{ color: theme.colors.text.primary, marginTop: 12 }}>
        Сводка параметров проекта
      </H2>
      <Grid columns={3} gap={16}>
        <Stat value="2 формата" label="Social (1080x1920) & A4 PDF" tone="info" />
        <Stat value="Vibrant Summer" label="Мягкий песочно-голубой градиент" tone="success" />
        <Stat value="Constantia" label="Премиальная академическая антиква" />
      </Grid>

      <H2 style={{ color: theme.colors.text.primary, marginTop: 16 }}>
        Анализ интеграции тем ("Лето, Дети, Хор, Творчество")
      </H2>
      <Table
        headers={["Тема", "Элементы на афише", "Статус проверки"]}
        columnAlign={["left", "left", "center"]}
        rowTone={["success", "success", "success", "success"]}
        rows={[
          [
            <Text weight="semibold">ЛЕТО</Text>,
            <Text>Солнце с лучами в правом верхнем углу, летний цветок слева, парящие зеленые листья, символизирующие свежий летний ветер.</Text>,
            <Pill active size="sm">Отлично</Pill>
          ],
          [
            <Text weight="semibold">ДЕТИ</Text>,
            <Text>Искренние детские лица на фотографиях коллажа — как на сцене во время выступления, так и в живом творческом процессе.</Text>,
            <Pill active size="sm">Отлично</Pill>
          ],
          [
            <Text weight="semibold">ХОР</Text>,
            <Text>Главное панорамное фото хора на сцене, логотип детского хора во главе афиши, указание школы и Филармонического общества.</Text>,
            <Pill active size="sm">Отлично</Pill>
          ],
          [
            <Text weight="semibold">ТВОРЧЕСТВО</Text>,
            <Text>Парящие полупрозрачные музыкальные ноты (одинарные и двойные), живые репетиции с укулеле в нижнем ряду коллажа.</Text>,
            <Pill active size="sm">Отлично</Pill>
          ]
        ]}
      />

      <H2 style={{ color: theme.colors.text.primary, marginTop: 16 }}>
        Контрольный список улучшений
      </H2>
      <TodoListCard
        todos={reviewTodos}
        defaultExpanded
      />

      <Card style={{ marginTop: 16 }}>
        <CardHeader>Физические файлы проекта</CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Row justify="space-between">
              <Text weight="medium">Шаблон афиши:</Text>
              <Text tone="secondary">/Users/nathalie/poster-khor/index.html</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Text weight="medium">Стили (CSS):</Text>
              <Text tone="secondary">/Users/nathalie/poster-khor/styles.css</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Text weight="medium">Изображение для соцсетей:</Text>
              <Text tone="secondary">/Users/nathalie/poster-khor/export-social.png (1080×1920)</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Text weight="medium">PDF-файл для печати (A4):</Text>
              <Text tone="secondary">/Users/nathalie/poster-khor/export-a4.pdf</Text>
            </Row>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
