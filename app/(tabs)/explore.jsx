import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { COLORS } from '../../constants/Colors';

const RecentUploadsScreen = () => {
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    const collections = ['Land', 'Area', 'Nature', 'Test'];
    const unsubscribes = [];

    const allUploads = [];

    collections.forEach((col) => {
      const q = query(collection(db, col), orderBy('createdAt', 'desc'), limit(10));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const uploads = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data.url && data.createdAt) {
              return {
                id: doc.id + '_' + col, // Unique key across collections
                url: data.url,
                description: data.description || '',
                createdAt: data.createdAt.toDate(),
                collection: col,
              };
            }
            return null;
          })
          .filter(Boolean);

        // Remove old items from same collection
        const filtered = allUploads.filter((item) => item.collection !== col);
        allUploads.length = 0;
        allUploads.push(...filtered, ...uploads);

        // Sort merged array by createdAt descending
        const sorted = [...allUploads].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
        setRecentUploads(sorted);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {item.collection} · {item.createdAt.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={recentUploads}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.header}>Recent Uploads</Text>}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 35,
    paddingHorizontal: 10,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text || '#222',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
    backgroundColor: COLORS.card || '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.text || '#333',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#777',
    fontWeight: "700",
  },
});

export default RecentUploadsScreen; 
