package com.terranova.terranova.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class AlmacenamientoImagenService {

    private final Path carpeta;
    private final String urlBase;

    public AlmacenamientoImagenService(
            @Value("${app.uploads.dir:uploads}") String dir,
            @Value("${app.uploads.base-url:http://localhost:8080/uploads/}") String urlBase) throws IOException {
        this.carpeta = Paths.get(dir).toAbsolutePath().normalize();
        this.urlBase = urlBase.endsWith("/") ? urlBase : urlBase + "/";
        Files.createDirectories(this.carpeta);
    }

    public String guardarImagen(MultipartFile imagen, Long tourId) throws IOException {
        String original = imagen.getOriginalFilename() == null ? "imagen" : imagen.getOriginalFilename();
        String nombreLimpio = original.replaceAll("[^A-Za-z0-9._-]", "_");
        String nombre = UUID.randomUUID() + "-" + nombreLimpio;

        Path carpetaTour = carpeta.resolve("tours").resolve(String.valueOf(tourId));
        Files.createDirectories(carpetaTour);

        try (InputStream entrada = imagen.getInputStream()) {
            Files.copy(entrada, carpetaTour.resolve(nombre), StandardCopyOption.REPLACE_EXISTING);
        }

        return urlBase + "tours/" + tourId + "/" + nombre;
    }
}
