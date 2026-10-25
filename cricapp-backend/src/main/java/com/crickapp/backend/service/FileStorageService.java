package com.crickapp.backend.service;

import com.crickapp.backend.exception.BusinessRuleException;
import com.crickapp.backend.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath;
    private final String uploadDir;

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/jpg"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".png",
            ".jpg",
            ".jpeg"
        );

    public FileStorageService(@Value("${app.upload-dir:./uploads/team-logos}") String uploadDir) {
        this.uploadDir = uploadDir;
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize upload folder: " + e.getMessage());
        }
    }

    /**
     * Stores a team logo file after validating content type, extension, and file size.
     * Generates a unique UUID filename to avoid directory traversal risks.
     *
     * @param file the multipart file uploaded by the client
     * @return the public URL path for the saved image
     */
    public String storeLogo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessRuleException("Logo file is required and cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("File size exceeds 2MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessRuleException("Only PNG and JPG/JPEG image formats are supported");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new BusinessRuleException("Invalid file name");
        }

        String cleanFilename = StringUtils.cleanPath(originalFilename);
        int lastDotIndex = cleanFilename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            throw new BusinessRuleException("File must have an extension (.png, .jpg, .jpeg)");
        }

        String extension = cleanFilename.substring(lastDotIndex).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BusinessRuleException("Invalid file extension. Only .png, .jpg, and .jpeg are allowed");
        }

        String generatedFilename = UUID.randomUUID().toString() + extension;
        Path targetLocation = uploadPath.resolve(generatedFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/team-logos/" + generatedFilename;
        } catch (IOException e) {
            throw new FileStorageException("Failed to save logo file: " + e.getMessage());
        }
    }

    /**
     * Deletes a logo file by its public URL path.
     *
     * @param publicUrl the public URL of the logo, e.g. /uploads/team-logos/abc.png
     */
    public void deleteLogo(String publicUrl) {
        if (!StringUtils.hasText(publicUrl)) {
            return;
        }

        try {
            int lastSlashIndex = publicUrl.lastIndexOf('/');
            if (lastSlashIndex != -1) {
                String filename = publicUrl.substring(lastSlashIndex + 1);
                Path filePath = uploadPath.resolve(filename).normalize();
                if (filePath.startsWith(uploadPath)) {
                    Files.deleteIfExists(filePath);
                }
            }
        } catch (IOException e) {
            // Silently ignore or log - file may already be removed
        }
    }
}
