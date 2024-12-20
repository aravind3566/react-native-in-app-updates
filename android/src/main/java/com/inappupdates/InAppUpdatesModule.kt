package com.inappupdates

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.app.Activity
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.model.InstallStatus

class InAppUpdatesModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

    private val appUpdateManager: AppUpdateManager = AppUpdateManagerFactory.create(reactContext)
    private val REQUEST_CODE_UPDATE = 1234

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
    fun checkForUpdate(updateType: String, promise: Promise) {
        val activity = currentActivity ?: return promise.reject("NO_ACTIVITY", "No current activity")

        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                when (updateType.uppercase()) {
                    "FLEXIBLE" -> startFlexibleUpdate(appUpdateInfo, activity, promise)
                    "IMMEDIATE" -> startImmediateUpdate(appUpdateInfo, activity, promise)
                    else -> promise.reject("INVALID_TYPE", "Update type must be 'FLEXIBLE' or 'IMMEDIATE'")
                }
            } else {
                promise.resolve("No update available")
            }
        }.addOnFailureListener { e ->
            promise.reject("UPDATE_CHECK_FAILED", e.localizedMessage, e)
        }
    }

    private fun startFlexibleUpdate(appUpdateInfo: AppUpdateInfo, activity: Activity, promise: Promise) {
        if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                AppUpdateType.FLEXIBLE,
                activity,
                REQUEST_CODE_UPDATE
            )

            // Monitor flexible update status and complete update
            appUpdateManager.registerListener { state ->
                if (state.installStatus() == InstallStatus.DOWNLOADED) {
                    appUpdateManager.completeUpdate()
                }
            }
            promise.resolve("Flexible update started")
        } else {
            promise.reject("NOT_ALLOWED", "Flexible update type not allowed")
        }
    }

    private fun startImmediateUpdate(appUpdateInfo: AppUpdateInfo, activity: Activity, promise: Promise) {
        if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                AppUpdateType.IMMEDIATE,
                activity,
                REQUEST_CODE_UPDATE
            )
            promise.resolve("Immediate update started")
        } else {
            promise.reject("NOT_ALLOWED", "Immediate update type not allowed")
        }
    }

  companion object {
    const val NAME = "InAppUpdates"
  }
}
