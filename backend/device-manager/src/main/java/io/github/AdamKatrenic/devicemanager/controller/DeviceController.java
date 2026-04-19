package io.github.AdamKatrenic.devicemanager.controller;

import io.github.AdamKatrenic.devicemanager.model.Device;
import io.github.AdamKatrenic.devicemanager.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @PostMapping
    public Device createDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Long id) {
        deviceRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable Long id, @RequestBody Device deviceDetails) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));

        device.setName(deviceDetails.getName());
        device.setModelName(deviceDetails.getModelName());
        device.setSerialNumber(deviceDetails.getSerialNumber());
        device.setStatus(deviceDetails.getStatus());

        return deviceRepository.save(device);
    }
}