import React from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { PROFILE } from '../../constants/strings';
import CustomButton from '../common/CustomButton';
import { ImagePath } from '../../constants/imagePath';

interface DeleteAccountModalProps {
  visible: boolean;
  onExportJournals: () => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onExportJournals,
  onConfirmDelete,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Warning Icon */}
          <Image source={ImagePath.DeleteAccountWarningIcon} style={styles.warningIcon} />

          {/* Title */}
          <Text style={styles.modalTitle}>{PROFILE.DELETE_ACCOUNT}</Text>

          {/* Warning Message */}
          <Text style={styles.modalMessage}>{PROFILE.DELETE_ACCOUNT_WARNING}</Text>

          {/* Buttons */}
          <CustomButton
            title={PROFILE.EXPORT_JOURNALS}
            onPress={onExportJournals}
            variant="secondary"
            style={styles.exportButton}
            textStyle={styles.exportButtonText}
            fullWidth={true}
          />

          <CustomButton
            title={PROFILE.DELETE_ACCOUNT}
            onPress={onConfirmDelete}
            variant="primary"
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            fullWidth={true}
          />

          <CustomButton
            title={PROFILE.CANCEL}
            onPress={onCancel}
            variant="ghost"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            fullWidth={true}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(24),
    width: '100%',
    maxWidth: scale(400),
    alignItems: 'center',
  },
  warningIcon: {
    width: scale(60),
    height: scale(60),
    marginBottom: scale(16),
  },
  modalTitle: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(12),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    textAlign: 'center',
    marginBottom: scale(24),
  },
  exportButton: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: scale(10),
    borderWidth: scale(0),
    paddingVertical: scale(14),
    marginBottom: scale(12),
  },
  exportButtonText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    borderRadius: scale(10),
    paddingVertical: scale(14),
    marginBottom: scale(12),
  },
  deleteButtonText: {
    fontSize: scaleFont(16),
    color: COLORS.WHITE,
  },
  cancelButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(10),
    paddingVertical: scale(14),
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  cancelButtonText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
  },
});

export default DeleteAccountModal;

