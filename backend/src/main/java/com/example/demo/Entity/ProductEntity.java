package com.example.demo.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String image;
    private double startingPrice;

    private LocalDateTime auctionStart;
    private LocalDateTime auctionEnd;

    private String status;
    private Long winnerBuyerId;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public double getStartingPrice() {
		return startingPrice;
	}
	public void setStartingPrice(double startingPrice) {
		this.startingPrice = startingPrice;
	}
	public LocalDateTime getAuctionStart() {
		return auctionStart;
	}
	public void setAuctionStart(LocalDateTime auctionStart) {
		this.auctionStart = auctionStart;
	}
	public LocalDateTime getAuctionEnd() {
		return auctionEnd;
	}
	public void setAuctionEnd(LocalDateTime auctionEnd) {
		this.auctionEnd = auctionEnd;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Long getWinnerBuyerId() {
		return winnerBuyerId;
	}
	public void setWinnerBuyerId(Long winnerBuyerId) {
		this.winnerBuyerId = winnerBuyerId;
	}
    
    
}