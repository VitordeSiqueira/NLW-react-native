import React from 'react';
import {
    SafeAreaViewBase,
    StyleSheet,
    View,
    Text
} from 'react-native';

export function UserIdentification() {
    return (
        <SafeAreaViewBase style={styles.container}>
            <View style={styles.content}>
                <View style={styles.form}>
                    <Text style={styles.emoji}>
                        😀
                    </Text>
                </View>
            </View>
        </SafeAreaViewBase>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    content: {

    },
    form: {

    },
    emoji: {

    }
})