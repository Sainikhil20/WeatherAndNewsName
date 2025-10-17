import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { NewsArticle } from '../types';
import { formatDate, truncateText } from '../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

interface NewsListProps {
  articles: NewsArticle[];
  onArticlePress: (url: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ articles, onArticlePress }) => {
  if (articles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No news articles available</Text>
      </View>
    );
  }

  const renderArticle = ({ item }: { item: NewsArticle }) => {
    return (
      <TouchableOpacity 
        style={styles.articleContainer}
        onPress={() => onArticlePress(item.url)}
        activeOpacity={0.7}
      >
        <View style={styles.articleContent}>
          {item.urlToImage && (
            <Image 
              source={{ uri: item.urlToImage }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.articleText}>
            <Text style={styles.articleTitle} numberOfLines={3}>
              {item.title}
            </Text>
            
            {item.description && (
              <Text style={styles.articleDescription} numberOfLines={2}>
                {truncateText(item.description, 120)}
              </Text>
            )}
            
            <View style={styles.articleMeta}>
              <Text style={styles.articleSource}>{item.source.name}</Text>
              <Text style={styles.articleDate}>
                {formatDate(item.publishedAt)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={(item, index) => `${item.url}-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  articleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleContent: {
    padding: 16,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  articleText: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    lineHeight: 24,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleSource: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    flex: 1,
    marginRight: 8,
  },
  articleDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
});

export default NewsList;