---
title: Cómo Implementar Tesseract en LangChain
published: 2023-03-16
description: Tutorial to implement OCR in Langchain
image: "./cover.png"
tags: [Tutorial, GenAI]
category: 'Data science'
draft: false 
lang: ''
---

La extracción de texto de imágenes es una tarea común en muchos proyectos de inteligencia artificial y aprendizaje automático. Tesseract es una de las herramientas más populares para el reconocimiento óptico de caracteres (OCR), y LangChain es una poderosa biblioteca que facilita la construcción de cadenas de procesamiento de lenguaje natural. En este artículo, te mostraré cómo integrar Tesseract en LangChain para crear una solución de OCR eficiente.

# **¿Qué es Tesseract?**  
Tesseract es un motor OCR de código abierto desarrollado por Google. Es capaz de reconocer texto en más de 100 idiomas y se puede entrenar para mejorar la precisión. Su simplicidad y eficacia lo han convertido en una elección popular para proyectos que requieren extracción de texto a partir de imágenes.

# **¿Qué es LangChain?**  
LangChain es una biblioteca diseñada para ayudar a los desarrolladores a construir aplicaciones de procesamiento de lenguaje natural (NLP) utilizando cadenas de procesamiento. Ofrece una estructura modular que facilita la integración de diferentes componentes de NLP, incluyendo herramientas de OCR como Tesseract.

## **Requisitos Previos**  
Antes de comenzar, asegúrate de tener instalados los siguientes programas y bibliotecas:

1. **Python 3.10**: LangChain y Tesseract son compatibles con Python 3.
2. **Tesseract**: Debes instalar Tesseract en la máquina donde se ejecutará el código. Si estás utilizando Ubuntu, sigue esta guía para una instalación correcta: Guía de instalación de Tesseract en Ubuntu. Para otros sistemas operativos, consulta la documentación oficial [aquí](https://github.com/tesseract-ocr/tesseract/wiki).
3. **Pytesseract**: Un contenedor de Python para Tesseract. Puedes instalarlo con pip:
   ```bash
   pip install pytesseract
   ```
4. **pdf2image**: Una biblioteca para convertir páginas de PDF en imágenes.
   ```bash
   pip install pdf2image
   ```
5. **LangChain**:
   ```bash
   pip install langchain langchain-community
   ```

## **Paso 1: Configurar Tesseract**  
Asegúrate de que Tesseract esté correctamente instalado y configurado en tu máquina. Esto implica que debes poder ejecutar Tesseract desde la línea de comandos y obtener la versión instalada.

```bash
tesseract --version
```

## **Paso 2: Crear un loader que utilice Tesseract en LangChain**  
Ahora que Tesseract está instalado, podemos integrarlo en LangChain. A continuación, te mostraré cómo crear un loader de PDFs, convertir sus páginas en imágenes y luego extraer el texto utilizando Tesseract.

**Código**:  

```python
from langchain_core.documents import Document
from langchain_core.document_loaders.base import BaseBlobParser
from langchain_core.document_loaders.blob_loaders import Blob
from langchain_community.document_loaders.pdf import BasePDFLoader

from typing import Iterator, List

class PyTesseractParser(BaseBlobParser):
    """Carga un PDF con pdf2image y extrae texto usando pytesseract."""

    def lazy_parse(self, blob: Blob) -> Iterator[Document]:
        """Analiza el blob de manera perezosa."""
        from pdf2image import convert_from_bytes
        from pytesseract import image_to_string

        with blob.as_bytes_io() as bytes_io:
            images = convert_from_bytes(bytes_io.read(), thread_count=4)
            yield from [
                Document(
                    page_content=image_to_string(img, lang='eng+spa'),
                    metadata={"source": blob.source, "page": page_number+1},
                )
                for page_number, img in enumerate(images)
            ]

class PyTesseractLoader(BasePDFLoader):
    """Carga un PDF con pdf2image y lo divide a nivel de caracteres.
    El cargador también almacena números de página en metadatos.
    """

    def __init__(self, file_path: str) -> None:
        """Inicializa con la ruta del archivo."""
        try:
            import pytesseract  # noqa:F401
        except ImportError:
            raise ImportError(
                "No se encontró el paquete pytesseract, instálalo con " "`pip install pytesseract`"
            )
        try:
            import pdf2image  # noqa:F401
        except ImportError:
            raise ImportError(
                "No se encontró el paquete pdf2image, instálalo con " "`pip install pdf2image`"
            )

        self.parser = PyTesseractParser()
        super().__init__(file_path)

    def load(self) -> List[Document]:
        """Carga la ruta dada como páginas."""
        return list(self.lazy_load())

    def lazy_load(self) -> Iterator[Document]:
        """Carga de manera perezosa la ruta dada como páginas."""
        blob = Blob.from_path(self.file_path)
        yield from self.parser.parse(blob)
        
def main():
    file_path = "ruta/a/tu/documento.pdf"
    loader = PyTesseractLoader(file_path)
    documents = loader.load()

    for doc in documents:
        print(f"Página {doc.metadata['page']}:")
        print(doc.page_content)

if __name__ == "__main__":
    main()

```

**Explicación del Código**:

1. **PyTesseractParser**: Este parser utiliza `pdf2image` para convertir las páginas de un PDF en imágenes y luego usa `pytesseract` para extraer el texto de cada imagen.
2. **PyTesseractLoader**: Este loader maneja la carga del archivo PDF y utiliza el parser para procesar el contenido del PDF. Almacena el texto extraído junto con metadatos que incluyen el número de página.


# **Conclusión**  
Integrar Tesseract con LangChain te permite construir poderosas aplicaciones de OCR con un flujo de trabajo estructurado y modular. Esta guía te ha mostrado los pasos básicos para comenzar, pero LangChain ofrece muchas más posibilidades para personalizar y extender tu cadena de procesamiento.

Espero que este artículo te haya sido útil y te inspire a explorar más sobre las capacidades de Tesseract y LangChain.