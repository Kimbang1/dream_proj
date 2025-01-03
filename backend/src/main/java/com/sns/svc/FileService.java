package com.sns.svc;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.nio.JpegWriter;
import com.sksamuel.scrimage.webp.WebpWriter;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileService {
	
	// 로컬 저장 경로 설정
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	// 로컬 파일 저장
	public String saveFile(MultipartFile file) throws IOException {
		// 파일 이름과 저장 경로
		String oriFileName = file.getOriginalFilename();
		String upFileName = System.currentTimeMillis() + "_" + oriFileName;
		
		Path path = Paths.get(uploadDir + File.separator + upFileName);
		
		File folder = new File(path.toString());
		if(folder.isDirectory() == false) {
			folder.mkdirs();
		}
		
		// 파일 저장
		try {
	        file.transferTo(path.toFile());
	    } catch (IllegalStateException e) {
	        log.error("IllegalStateException while saving file: {}", e.getMessage(), e);
	        throw new IOException("Failed to save file due to illegal state", e);
	    } catch (IOException e) {
	        log.error("IOException while saving file: {}", e.getMessage(), e);
	        throw new IOException("Failed to save file due to IO issue", e);
	    }
		
		// 저장된 파일 경로 반환
		return path.toString();
	}
	
	// 이미지 파일을 .webp로 변환, 손실 압축
	public File convertToWebp(String fileName, File originalFile) {
		try {
			return ImmutableImage.loader()	// 라이브러리 객체 생성
                    .fromFile(originalFile) // .jpg or .png File 가져옴
					.output(WebpWriter.DEFAULT, new File(fileName + ".webp"));
		} catch (IOException e) {
			log.error("Error converting image to webp with lossy compression: {}", e.getMessage(), e);
	        throw new RuntimeException("Failed to convert image to webp (lossy)", e);
	    }
	}
	
	// 이미지 파일을 .webp로 변환, 무손실 압축
	public File convertToWebpWithLossless(String fileName, File originalFile) {
		try {
            return ImmutableImage.loader()	// 라이브러리 객체 생성
                    .fromFile(originalFile) // .jpg or .png File 가져옴
                    .output(WebpWriter.DEFAULT.withLossless(), new File(fileName + ".webp")); // 무손실 압축 설정, fileName.webp로 파일 생성
        } catch (IOException e) {
        	log.error("Error converting image to webp with lossless compression: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to convert image to webp (lossless)", e);
        }
	}
	
	// .webp파일을 원본 확장자로 변환
	public File convertWebpToOrigin(String fileName, File webpFile) {
		try {
			// ImmutableImage를 사용하여 .webp 파일 로드
			ImmutableImage image = ImmutableImage.loader().fromFile(webpFile);
			
			// 원본 확장자로 변환 및 저장
			File originFile = new File(fileName + ".jpg");
			image.output(JpegWriter.Default, originFile);
//			image.output(PngWriter.NoCompression, originFile);
			
			return originFile;
		} catch (IOException e ) {
			log.error("Error converting webp to original format: {}", e.getMessage(), e);
	        throw new RuntimeException("Failed to convert webp to original format", e);
	    }
	}

	
}
