package io.github.AdamKatrenic.devicemanager.repository;

import io.github.AdamKatrenic.devicemanager.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
}