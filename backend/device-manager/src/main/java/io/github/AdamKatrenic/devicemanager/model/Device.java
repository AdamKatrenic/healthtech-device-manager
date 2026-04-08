package io.github.AdamKatrenic.devicemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // napr. "MRI Scanner"
    private String modelName;    // napr. "MAGNETOM Terra"
    private String serialNumber; // napr. "SN-998877"
    private String status;       // ONLINE, OFFLINE, MAINTENANCE
}