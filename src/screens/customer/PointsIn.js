import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useThemeStore } from "../../store/themeStore"
import { useState } from "react"
import AppHeader from "./header/AppHeader"
import CoolButton from "../../component/customer/common/CoolButton"
import { scaleWidth, scaleHeight } from "../../utils/scaling"

// Payment logos
const esewaLogo = require("../../assets/esewa.png")
const khaltiLogo = require("../../assets/khalti.png")

const PointsIn = () => {
  const insets = useSafeAreaInsets()
  const [disableBtn, setdisableBtn] = useState(false)
  const { isLight } = useThemeStore()
  const [crownAmount, setCrownAmount] = useState("")
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('esewa') // 'esewa' or 'khalti'

  const colors = {
    background: isLight ? "#ffffff" : "#000000",
    text: isLight ? "#000000" : "#ffffff",
    textSecondary: isLight ? "#666666" : "#999999",
    border: isLight ? "#e0e0e0" : "#333333",
    inputBorder: isLight ? "#000000" : "#ffffff",
    inputBg: isLight ? "#f8f9fa" : "#1a1a1a",
    cardBg: isLight ? "#ffffff" : "#0f0f0f",
  }

  const handleSubmit = async () => {
    if (!crownAmount) {
      setError('Please enter amount');
      return;
    }
    
    const amount = parseInt(crownAmount, 10);
    if (isNaN(amount) || amount < 10 || amount > 10000) {
      setError('Amount must be between 10 and 10,000');
      return;
    }
    
    setError('');
    setdisableBtn(true);

    // TODO: Integrate payment SDK
    console.log(`Redirecting to ${selectedMethod.toUpperCase()}...`, { amount: crownAmount, method: selectedMethod });
    
    setTimeout(() => {
      setdisableBtn(false);
    }, 2000);
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle={isLight ? "dark-content" : "light-content"} />
      <View style={[styles.container, {
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }]}>

        <AppHeader
          backButton={true}
          title={'Add Points'}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Payment Method Selection */}
          <View style={styles.paymentSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
            
            {/* eSewa Option */}
            <Pressable 
              onPress={() => setSelectedMethod('esewa')}
              style={[styles.paymentMethodCard, {
                backgroundColor: colors.cardBg,
                borderColor: selectedMethod === 'esewa' ? '#60BB46' : colors.border,
              }]}
            >
              <View style={styles.paymentMethodContent}>
                <Image
                  source={esewaLogo}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodName, { color: colors.text }]}>eSewa</Text>
                  <Text style={[styles.paymentMethodDesc, { color: colors.textSecondary }]}>Mobile Wallet Payment</Text>
                </View>
                {selectedMethod === 'esewa' && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={scaleWidth(24)} color="#60BB46" />
                  </View>
                )}
              </View>
            </Pressable>

            {/* Khalti Option */}
            <Pressable 
              onPress={() => setSelectedMethod('khalti')}
              style={[styles.paymentMethodCard, {
                backgroundColor: colors.cardBg,
                borderColor: selectedMethod === 'khalti' ? '#5C2D91' : colors.border,
              }]}
            >
              <View style={styles.paymentMethodContent}>
                <Image
                  source={khaltiLogo}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodName, { color: colors.text }]}>Khalti</Text>
                  <Text style={[styles.paymentMethodDesc, { color: colors.textSecondary }]}>Digital Wallet Payment</Text>
                </View>
                {selectedMethod === 'khalti' && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={scaleWidth(24)} color="#5C2D91" />
                  </View>
                )}
              </View>
            </Pressable>

            {/* Instructions */}
            <View style={[styles.instructionsCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.instructionsTitle, { color: colors.text }]}>How to add points</Text>
              <View style={styles.instructionItem}>
                <Text style={[styles.bulletPoint, { color: selectedMethod === 'esewa' ? '#60BB46' : '#5C2D91' }]}>•</Text>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Enter your desired points amount
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={[styles.bulletPoint, { color: selectedMethod === 'esewa' ? '#60BB46' : '#5C2D91' }]}>•</Text>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  You'll be redirected to {selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} to complete payment
                </Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Crown Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Points Amount</Text>
              <View style={[styles.inputWrapper, {
                borderColor: error ? '#FF4444' : colors.inputBorder,
                backgroundColor: 'transparent',
              }]}>
                <View style={[
                  styles.pointsIconContainer,
                  { backgroundColor: isLight ? '#14B8A6' : 'rgba(32, 201, 151, 0.2)' },
                  isLight && {
                    elevation: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.35,
                    shadowRadius: 4.5,
                  }
                ]}>
                  <MaterialCommunityIcons
                    name="star-four-points-outline"
                    size={scaleWidth(16)}
                    color={isLight ? "#ffffff" : "#20c997"}
                  />
                </View>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter amount (e.g., 100)"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={crownAmount}
                  onChangeText={(text) => {
                    setCrownAmount(text);
                    if (error) {
                      setError('');
                    }
                  }}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={scaleWidth(14)} color="#FF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <CoolButton handlePress={handleSubmit} disableBtn={disableBtn} title={'Add Points'} />
        </View>

      </View>
    </>
  )
}

export default PointsIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  footer: {
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleHeight(10),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scaleHeight(40),
  },
  paymentSection: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleHeight(20),
  },
  sectionTitle: {
    fontSize: scaleWidth(18),
    fontWeight: '600',
    marginBottom: scaleHeight(15),
  },
  paymentMethodCard: {
    borderRadius: scaleWidth(12),
    borderWidth: scaleWidth(2),
    padding: scaleWidth(16),
    marginBottom: scaleHeight(12),
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLogo: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(8),
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: scaleWidth(14),
  },
  paymentMethodName: {
    fontSize: scaleWidth(17),
    fontWeight: '600',
  },
  paymentMethodDesc: {
    fontSize: scaleWidth(13),
    marginTop: scaleHeight(2),
  },
  selectedBadge: {
    marginLeft: scaleWidth(10),
  },
  instructionsCard: {
    borderRadius: scaleWidth(12),
    borderWidth: scaleWidth(1),
    padding: scaleWidth(16),
    marginTop: scaleHeight(8),
    marginBottom: scaleHeight(20),
  },
  instructionsTitle: {
    fontSize: scaleWidth(15),
    fontWeight: '600',
    marginBottom: scaleHeight(12),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleHeight(8),
  },
  bulletPoint: {
    fontSize: scaleWidth(16),
    fontWeight: '700',
    marginRight: scaleWidth(8),
    lineHeight: scaleHeight(20),
  },
  instructionText: {
    flex: 1,
    fontSize: scaleWidth(13),
    fontWeight: '400',
    lineHeight: scaleHeight(20),
  },
  formContainer: {
    paddingHorizontal: scaleWidth(20),
  },
  inputContainer: {
    marginBottom: scaleHeight(20),
  },
  inputLabel: {
    fontSize: scaleWidth(15),
    fontWeight: "600",
    marginBottom: scaleHeight(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scaleWidth(1.5),
    borderRadius: scaleWidth(25),
    paddingHorizontal: scaleWidth(8),
    gap: scaleWidth(12),
  },
  pointsIconContainer: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: scaleHeight(14),
    fontSize: scaleWidth(16),
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(4),
    marginTop: scaleHeight(6),
  },
  errorText: {
    fontSize: scaleWidth(12),
    fontWeight: '500',
    color: '#FF4444',
  },
})