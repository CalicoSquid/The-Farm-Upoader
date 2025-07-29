import React, { useState } from 'react';
import { View, ScrollView, Image, TextInput, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../../firebase.config"; // adjust path to your firebase.js
import { COLORS } from '../../constants/Colors';
import hero from "../../assets/images/splash-icon.png";

export default function UploadImageScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('Area');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const clearForm = () => {
    setImageUri(null);
    setDescription('');
    setSelectedCollection('Area');
  };

  const uploadImage = async () => {
    if (!imageUri || !description.trim()) {
      alert('Please select an image and enter a description.');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', 'farmUploads');

      const response = await fetch('https://api.cloudinary.com/v1_1/dgt586eqo/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Upload failed');
      }

      const resizedUrl = data.secure_url.replace('/upload/', '/upload/w_1000/');

      await addDoc(collection(db, selectedCollection), {
        url: resizedUrl,
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      alert('Upload successful!');
      clearForm();
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 50, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Image source={hero} style={styles.image} />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.buttonTop} activeOpacity={0.8} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity style={[styles.buttonTop, styles.clearButton]} onPress={clearForm}>
            <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Picker
        selectedValue={selectedCollection}
        onValueChange={(itemValue) => setSelectedCollection(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Area" value="Area" />
        <Picker.Item label="Land" value="Land" />
        <Picker.Item label="Nature" value="Nature" />
        <Picker.Item label="Test" value="Test" />
      </Picker>

      {uploading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonTop: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonText: {
    color: '#333',
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginVertical: 16,
    resizeMode: 'cover',
    backgroundColor: '#E0E0E0',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: COLORS.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBlock: 16,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginVertical: 16,
    resizeMode: 'contain',
  },
});
