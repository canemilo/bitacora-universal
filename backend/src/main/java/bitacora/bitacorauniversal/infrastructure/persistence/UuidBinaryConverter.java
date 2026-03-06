package bitacora.bitacorauniversal.infrastructure.persistence;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.nio.ByteBuffer;
import java.util.UUID;

@Converter(autoApply = true)
public class UuidBinaryConverter implements AttributeConverter<UUID, byte[]> {

    @Override
    public byte[] convertToDatabaseColumn(UUID attribute) {
        if (attribute == null) return null;
        ByteBuffer bb = ByteBuffer.allocate(16);
        bb.putLong(attribute.getMostSignificantBits());
        bb.putLong(attribute.getLeastSignificantBits());
        return bb.array();
    }

    @Override
    public UUID convertToEntityAttribute(byte[] dbData) {
        if (dbData == null || dbData.length != 16) return null;
        ByteBuffer bb = ByteBuffer.wrap(dbData);
        return new UUID(bb.getLong(), bb.getLong());
    }
}
