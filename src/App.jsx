import React, { useState, useEffect } from 'react';
import styles from '../styles/App.module.css';
import defaultSquareOverlayImage from './assets/LOGOQUADRADO.png';
import defaultPortraitOverlayImage from './assets/LOGORETRATO.png';

const App = () => {
  const [baseImage, setBaseImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(defaultSquareOverlayImage);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('square');

  const handleBaseImageChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBaseImage(e.target.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (baseImage) {
      setLoading(true);

      const overlayImg = new Image();
      overlayImg.crossOrigin = 'anonymous';
      overlayImg.src =
        format === 'square' ? defaultSquareOverlayImage : defaultPortraitOverlayImage;
      overlayImg.onload = () => {
        const canvas = document.createElement('canvas');
        let canvasWidth, canvasHeight;

        if (format === 'square') {
          // Formato quadrado (1:1)
          canvasWidth = overlayImg.width;
          canvasHeight = overlayImg.width;
        } else if (format === 'portrait') {
          // Formato retrato (4:5)
          canvasWidth = overlayImg.width;
          canvasHeight = (overlayImg.width / 4) * 5;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const context = canvas.getContext('2d');

        // Adiciona blur(10px) diretamente à imagem de base
        context.filter = 'blur(10px)';
        context.drawImage(
          baseImageElement,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        // Redefine o filtro para o valor padrão
        context.filter = 'none';

        // Adiciona opacidade(0.7) à imagem de sobreposição (imagem padrão)
        context.globalAlpha = 0.7;
        context.drawImage(
          overlayImg,
          0,
          0,
          overlayImg.width,
          overlayImg.height,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        // Redefine a opacidade para o valor padrão
        context.globalAlpha = 1.0;

        // Adiciona texto no canto inferior direito
        const text = 'Arraste para o lado >>';
        const fontSize = canvasWidth * 0.03; // Define o tamanho da fonte como 3% do tamanho da imagem
        context.font = `${fontSize}px Arial`;
        context.fillStyle = 'white';
        context.textAlign = 'right';
        context.textBaseline = 'bottom';
        const margin = 30;
        context.fillText(text, canvas.width - margin, canvas.height - margin);

        const combinedImageDataURL = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = combinedImageDataURL;
        downloadLink.download = `combined_image_${format}.png`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setLoading(false);
      };
    }
  };

  const handleClearImage = () => {
    setBaseImage(null);
  };

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src =
      format === 'square' ? defaultSquareOverlayImage : defaultPortraitOverlayImage;
    image.onload = () => setOverlayImage(image.src);
  }, [format]);

  let baseImageElement;

  const estiloInline = {
    fontSize: '23px',
    fontWeight: 'bold',
    marginRight: '10px'
  };

  return (
    <div className={styles.appContainer}>
      <h1>Gerador de Imagem</h1>

      {/* Base Image */}
      {baseImage ? null : (
        <div className={styles.boxInput}>
          <input type="file" id='inputId' className={styles.input} accept="image/*" onChange={handleBaseImageChange} />
          <label htmlFor="inputId" className={styles.btnInput}>
            <div>
              <i className="bi bi-plus-circle-fill" style={estiloInline}></i>
              <span>Enviar Imagem</span>
            </div>
          </label>
        </div>
      )}

      {loading && <div className={styles.spinner}></div>}
      {baseImage && !loading && (
        <div className={styles.overlayContainer}>
          <div className={styles.overlayImageContainer}>
            <img
              alt="Base"
              className={styles.baseImage}
              style={{ filter: 'blur(10px)' }}
              ref={(img) => {
                if (img) {
                  img.onload = () => {
                    baseImageElement = img;
                  };
                  img.src = baseImage;
                }
              }}
            />

            <img
              src={overlayImage}
              alt="Overlay"
              className={styles.overlayImage}
            />
          </div>
        </div>
      )}

      {/* Choose Format */}
      {baseImage && !loading && (
        <div className={styles.boxFormat}>
          <span>Escolha um formato:</span>
          <div className={styles.formatButtons}>
            <button
              className={`${styles.formatButton} ${format === 'square' && styles.formatButtonActive}`}
              onClick={() => setFormat('square')}
            >
              Quadrado
            </button>
            <button
              className={`${styles.formatButton} ${format === 'portrait' && styles.formatButtonActive}`}
              onClick={() => setFormat('portrait')}
            >
              Retrato
            </button>
          </div>
        </div>
      )}

      {/* Download and Clear Buttons */}
      {baseImage && !loading && (
        <div className={styles.buttons}>
          <button className={styles.btnDownload} onClick={handleDownload}>Download Image</button>
          <button className={styles.btnChange} onClick={handleClearImage}>Change Image</button>
        </div>
      )}
      {
        <div className={styles.footer}>
          <span>Produzido por <a href="https://nathanrochaprofile.netlify.app/" target='blank' className={styles.link}>Nathan</a></span>
        </div>
      }
    </div>
  );
};

export default App;
